export const LISTING_TYPES = [
  { value: 'sell', label: 'Sell' },
  { value: 'rent', label: 'Rent' },
  { value: 'lend', label: 'Lend' },
  { value: 'donate', label: 'Donate' },
];

export const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const LISTING_STATUSES = [
  { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
  { value: 'reserved', label: 'Reserved', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sold', label: 'Sold', color: 'bg-gray-100 text-gray-800' },
  { value: 'rented', label: 'Rented', color: 'bg-blue-100 text-blue-800' },
  { value: 'borrowed', label: 'Borrowed', color: 'bg-purple-100 text-purple-800' },
  { value: 'donated', label: 'Donated', color: 'bg-pink-100 text-pink-800' },
  { value: 'unavailable', label: 'Unavailable', color: 'bg-red-100 text-red-800' },
];

export const REQUEST_TYPES = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'borrow', label: 'Borrow' },
];

export const REQUEST_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'matched', label: 'Matched', color: 'bg-blue-100 text-blue-800' },
  { value: 'fulfilled', label: 'Fulfilled', color: 'bg-gray-100 text-gray-800' },
  { value: 'expired', label: 'Expired', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const REPORT_REASONS = [
  { value: 'harassment', label: 'Harassment / Abuse' },
  { value: 'threatening', label: 'Threatening Behavior' },
  { value: 'scam', label: 'Scam / Fraud' },
  { value: 'prohibited', label: 'Prohibited Content / Item' },
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'other', label: 'Other' },
];

export const TICKET_CATEGORIES = [
  { value: 'transaction', label: 'Transaction / Payment Dispute' },
  { value: 'account', label: 'Account Problem' },
  { value: 'appeal', label: 'Moderation Appeal' },
  { value: 'harassment', label: 'Repeated Harassment' },
  { value: 'general', label: 'General Complaint' },
];

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_review', label: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'waiting_user', label: 'Waiting for User', color: 'bg-orange-100 text-orange-800' },
  { value: 'waiting_action', label: 'Waiting for Action', color: 'bg-purple-100 text-purple-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' },
];

export const CAMPUS_LOCATIONS = [
  'Library Entrance',
  'Academic Block Lobby',
  'Main Gate',
  'Hostel Gate',
  'Cafeteria',
  'Sports Complex',
  'Computer Lab Building',
  'Admin Block',
];

export const DOMAINS = [
  'Academics',
  'Projects & Electronics',
  'Hostel & Campus Life',
  'Sports & Fitness',
  'Other Student Resources',
];
