const Tag = require('../models/Tag');
const User = require('../models/User');
const Listing = require('../models/Listing');

exports.getPopularTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .sort({ count: -1 })
      .limit(20);
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const listings = await Listing.find({
      tags: tag.name,
      status: 'available',
    })
      .populate('owner', 'name avatar verified')
      .populate('domain', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({ tag, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const user = await User.findById(req.user._id);
    const index = user.followedTags.indexOf(tag._id);

    if (index > -1) {
      user.followedTags.splice(index, 1);
      tag.followers = tag.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      user.followedTags.push(tag._id);
      tag.followers.push(req.user._id);
    }

    await user.save();
    await tag.save();

    res.json({
      followed: index === -1,
      followersCount: tag.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchTags = async (req, res) => {
  try {
    const query = req.params.query;
    const tags = await Tag.find({
      name: { $regex: query, $options: 'i' },
    })
      .sort({ count: -1 })
      .limit(10);

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const existing = await Tag.findOne({ slug });
    if (existing) {
      return res.json(existing);
    }

    const tag = await Tag.create({
      name: name.toLowerCase(),
      slug,
      followers: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { followedTags: tag._id },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
