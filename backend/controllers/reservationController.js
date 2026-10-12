const Reservation = require('../models/Reservation');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');

exports.createReservation = async (req, res) => {
  try {
    const { listingId, duration } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ message: 'Listing is not available' });
    }

    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot reserve your own listing' });
    }

    const existingReservation = await Reservation.findOne({
      listing: listingId,
      user: req.user._id,
      status: 'active',
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'You already have an active reservation' });
    }

    const days = parseInt(duration) || 3;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const reservation = await Reservation.create({
      listing: listingId,
      user: req.user._id,
      expiresAt,
    });

    listing.status = 'reserved';
    listing.reservedBy = req.user._id;
    listing.reservedUntil = expiresAt;
    await listing.save();

    await Notification.create({
      user: listing.owner,
      type: 'reservation',
      title: 'Item Reserved',
      message: `${req.user.name} reserved your listing "${listing.title}"`,
      link: `/listing/${listing._id}`,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user._id,
      status: { $in: ['active', 'expired'] },
    })
      .populate({
        path: 'listing',
        populate: { path: 'owner', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reservation.status = 'expired';
    await reservation.save();

    const listing = await Listing.findById(reservation.listing);
    if (listing) {
      listing.status = 'available';
      listing.reservedBy = null;
      listing.reservedUntil = null;
      await listing.save();
    }

    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const listing = await Listing.findById(reservation.listing);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString() &&
        reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reservation.status = 'completed';
    await reservation.save();

    if (listing.type === 'sell') {
      listing.status = 'sold';
    } else if (listing.type === 'rent') {
      listing.status = 'available';
    } else if (listing.type === 'lend') {
      listing.status = 'available';
    }
    listing.reservedBy = null;
    listing.reservedUntil = null;
    await listing.save();

    const notifyUser = req.user._id.toString() === listing.owner.toString()
      ? reservation.user
      : listing.owner;

    await Notification.create({
      user: notifyUser,
      type: 'transaction',
      title: 'Transaction Completed',
      message: `The transaction for "${listing.title}" has been completed`,
      link: `/listing/${listing._id}`,
    });

    res.json({ message: 'Reservation completed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListingReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      listing: req.params.listingId,
      status: 'active',
    })
      .populate('user', 'name avatar');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
