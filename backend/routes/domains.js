const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');

router.get('/', async (req, res) => {
  try {
    const domains = await Domain.find().sort({ name: 1 });
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.slug });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    res.json(domain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
