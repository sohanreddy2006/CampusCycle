export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatPrice = (price, type) => {
  if (type === 'donate') return 'Free';
  if (type === 'lend') return `Lend`;
  return `$${price}`;
};

export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-100 text-gray-800',
    rented: 'bg-blue-100 text-blue-800',
    borrowed: 'bg-purple-100 text-purple-800',
    donated: 'bg-pink-100 text-pink-800',
    unavailable: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    matched: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-gray-100 text-gray-800',
    expired: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
