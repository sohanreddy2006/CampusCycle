const Listing = require('../models/Listing');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Notification = require('../models/Notification');

exports.createListing = async (req, res) => {
  try {
    const {
      title, description, photos, type, price, rentPrice,
      rentDuration, deposit, condition, availability,
      domain, category, subcategory, tags, location
    } = req.body;

    const listing = await Listing.create({
      owner: req.user._id,
      title, description, photos, type, price, rentPrice,
      rentDuration, deposit, condition, availability,
      domain, category, subcategory, tags, location,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'reputation.listings': 1 }
    });

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName || !tagName.trim()) continue;
        const slug = tagName.toLowerCase().replace(/\s+/g, '-');
        const tag = await Tag.findOneAndUpdate(
          { slug },
          { $inc: { count: 1 }, $setOnInsert: { name: tagName.trim().toLowerCase(), slug } },
          { upsert: true, new: true }
        );

        if (tag && tag.followers && tag.followers.length > 0) {
          for (const followerId of tag.followers) {
            if (followerId.toString() !== req.user._id.toString()) {
              await Notification.create({
                user: followerId,
                type: 'tag_match',
                title: 'New listing matches followed tag',
                message: `A new listing "${title}" matches #${tagName}`,
                link: `/listing/${listing._id}`,
              });
            }
          }
        }
      }
    }

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, search, type, domain,
      category, condition, minPrice, maxPrice,
      location, status = 'available', sort = '-createdAt'
    } = req.query;

    const query = { status };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (type) query.type = type;
    if (domain) query.domain = domain;
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (location) query.location = location;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query)
      .populate('owner', 'name avatar verified')
      .populate('domain', 'name slug icon')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name avatar verified reputation')
      .populate('domain', 'name slug icon')
      .populate('reservedBy', 'name avatar');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    listing.status = status;
    await listing.save();

    res.json(listing);
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

exports.getListingsByDomain = async (req, res) => {
  try {
    const listings = await Listing.find({
      domain: req.params.domainId,
      status: 'available',
    })
      .populate('owner', 'name avatar verified')
      .populate('domain', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
