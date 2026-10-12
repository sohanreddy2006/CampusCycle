const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '' },
  categories: [{
    name: { type: String, required: true },
    slug: { type: String, required: true },
    items: [{
      name: { type: String },
      slug: { type: String },
      defaultTags: [String],
    }],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Domain', domainSchema);
