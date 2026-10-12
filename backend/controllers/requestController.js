const Request = require('../models/Request');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, type, requiredDate, duration, domain, category, tags } = req.body;

    const request = await Request.create({
      requester: req.user._id,
      title, description, type, requiredDate, duration, domain, category, tags,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, search, type,
      domain, category, status = 'active', sort = '-createdAt',
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

    const requests = await Request.find(query)
      .populate('requester', 'name avatar verified')
      .populate('domain', 'name slug icon')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name avatar verified reputation')
      .populate('domain', 'name slug icon')
      .populate('matchedListing');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate('domain', 'name slug icon')
      .populate('matchedListing', 'title photos type price status')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fulfillRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'fulfilled';
    request.matchedListing = req.body.listingId;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
