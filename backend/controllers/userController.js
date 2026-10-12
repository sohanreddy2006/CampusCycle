const User = require('../models/User');
const Listing = require('../models/Listing');
const Tag = require('../models/Tag');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-email -phone -isActive -suspendedUntil -wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.params.id })
      .populate('domain', 'name slug icon')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id })
      .populate('domain', 'name slug icon')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'domain', select: 'name slug icon' },
    });
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;

    const index = user.wishlist.indexOf(listingId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(listingId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist, added: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlistCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wishlist');
    res.json({ count: user.wishlist.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowedTags = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('followedTags');
    res.json(user.followedTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user._id,
      status: { $in: ['sold', 'rented', 'borrowed', 'donated'] },
    }).sort({ updatedAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
