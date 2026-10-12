const mongoose = require('mongoose');
const config = require('../config/config');

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
});

const Domain = mongoose.model('Domain', domainSchema);

const domains = [
  {
    name: 'Academics',
    slug: 'academics',
    icon: '📚',
    categories: [
      {
        name: 'Books',
        slug: 'books',
        items: [
          { name: 'Textbooks', slug: 'textbooks', defaultTags: ['textbook', 'academic'] },
          { name: 'Reference Books', slug: 'reference-books', defaultTags: ['reference', 'academic'] },
          { name: 'Novels', slug: 'novels', defaultTags: ['novel', 'reading'] },
        ],
      },
      {
        name: 'Calculators',
        slug: 'calculators',
        items: [
          { name: 'Scientific Calculator', slug: 'scientific-calculator', defaultTags: ['calculator', 'scientific'] },
          { name: 'Graphing Calculator', slug: 'graphing-calculator', defaultTags: ['calculator', 'graphing'] },
        ],
      },
      {
        name: 'Laboratory Equipment',
        slug: 'laboratory-equipment',
        items: [
          { name: 'Lab Coat', slug: 'lab-coat', defaultTags: ['labcoat', 'laboratory'] },
          { name: 'Microscope', slug: 'microscope', defaultTags: ['microscope', 'laboratory'] },
        ],
      },
      {
        name: 'Drawing Materials',
        slug: 'drawing-materials',
        items: [
          { name: 'Drawing Board', slug: 'drawing-board', defaultTags: ['drawing', 'engineering'] },
          { name: 'Compass Set', slug: 'compass-set', defaultTags: ['compass', 'drawing'] },
        ],
      },
    ],
  },
  {
    name: 'Projects & Electronics',
    slug: 'projects-electronics',
    icon: '🔌',
    categories: [
      {
        name: 'Arduino',
        slug: 'arduino',
        items: [
          { name: 'Arduino Uno', slug: 'arduino-uno', defaultTags: ['arduino', 'electronics', 'project'] },
          { name: 'Arduino Mega', slug: 'arduino-mega', defaultTags: ['arduino', 'electronics', 'project'] },
          { name: 'Arduino Nano', slug: 'arduino-nano', defaultTags: ['arduino', 'electronics', 'project'] },
        ],
      },
      {
        name: 'Raspberry Pi',
        slug: 'raspberry-pi',
        items: [
          { name: 'Raspberry Pi 4', slug: 'raspberry-pi-4', defaultTags: ['raspberrypi', 'electronics', 'project'] },
          { name: 'Raspberry Pi Zero', slug: 'raspberry-pi-zero', defaultTags: ['raspberrypi', 'electronics'] },
        ],
      },
      {
        name: 'Sensors',
        slug: 'sensors',
        items: [
          { name: 'Temperature Sensor', slug: 'temperature-sensor', defaultTags: ['sensor', 'electronics'] },
          { name: 'Ultrasonic Sensor', slug: 'ultrasonic-sensor', defaultTags: ['sensor', 'electronics'] },
        ],
      },
      {
        name: 'Components',
        slug: 'components',
        items: [
          { name: 'Breadboard', slug: 'breadboard', defaultTags: ['breadboard', 'electronics'] },
          { name: 'Jumper Wires', slug: 'jumper-wires', defaultTags: ['jumperwires', 'electronics'] },
          { name: 'Resistors Pack', slug: 'resistors-pack', defaultTags: ['resistors', 'electronics'] },
        ],
      },
      {
        name: 'Tools',
        slug: 'tools',
        items: [
          { name: 'Soldering Iron', slug: 'soldering-iron', defaultTags: ['soldering', 'tools'] },
          { name: 'Multimeter', slug: 'multimeter', defaultTags: ['multimeter', 'tools', 'electronics'] },
        ],
      },
    ],
  },
  {
    name: 'Hostel & Campus Life',
    slug: 'hostel-campus-life',
    icon: '🏠',
    categories: [
      {
        name: 'Furniture',
        slug: 'furniture',
        items: [
          { name: 'Study Table', slug: 'study-table', defaultTags: ['table', 'furniture', 'hostel'] },
          { name: 'Chair', slug: 'chair', defaultTags: ['chair', 'furniture', 'hostel'] },
        ],
      },
      {
        name: 'Electronics',
        slug: 'hostel-electronics',
        items: [
          { name: 'Desk Lamp', slug: 'desk-lamp', defaultTags: ['lamp', 'hostel'] },
          { name: 'Extension Board', slug: 'extension-board', defaultTags: ['extension', 'hostel'] },
        ],
      },
      {
        name: 'Room Essentials',
        slug: 'room-essentials',
        items: [
          { name: 'Bed Sheet', slug: 'bed-sheet', defaultTags: ['bedsheet', 'hostel'] },
          { name: 'Pillow', slug: 'pillow', defaultTags: ['pillow', 'hostel'] },
        ],
      },
    ],
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    icon: '⚽',
    categories: [
      {
        name: 'Cycles',
        slug: 'cycles',
        items: [
          { name: 'Mountain Bike', slug: 'mountain-bike', defaultTags: ['cycle', 'sports'] },
          { name: 'City Bike', slug: 'city-bike', defaultTags: ['cycle', 'sports'] },
        ],
      },
      {
        name: 'Sports Equipment',
        slug: 'sports-equipment',
        items: [
          { name: 'Cricket Bat', slug: 'cricket-bat', defaultTags: ['cricket', 'sports'] },
          { name: 'Football', slug: 'football', defaultTags: ['football', 'sports'] },
          { name: 'Badminton Racket', slug: 'badminton-racket', defaultTags: ['badminton', 'sports'] },
        ],
      },
      {
        name: 'Fitness',
        slug: 'fitness',
        items: [
          { name: 'Dumbbells', slug: 'dumbbells', defaultTags: ['fitness', 'gym'] },
          { name: 'Resistance Bands', slug: 'resistance-bands', defaultTags: ['fitness', 'exercise'] },
        ],
      },
    ],
  },
  {
    name: 'Other Student Resources',
    slug: 'other-resources',
    icon: '📦',
    categories: [
      {
        name: 'Stationery',
        slug: 'stationery',
        items: [
          { name: 'Pen Pack', slug: 'pen-pack', defaultTags: ['stationery', 'pens'] },
          { name: 'Notebooks', slug: 'notebooks', defaultTags: ['notebooks', 'stationery'] },
        ],
      },
      {
        name: 'Notes & Study Material',
        slug: 'notes-study-material',
        items: [
          { name: 'Handwritten Notes', slug: 'handwritten-notes', defaultTags: ['notes', 'study'] },
          { name: 'Printouts', slug: 'printouts', defaultTags: ['printouts', 'study'] },
        ],
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await Domain.deleteMany({});
    console.log('Existing domains cleared');

    await Domain.insertMany(domains);
    console.log('Domains seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
