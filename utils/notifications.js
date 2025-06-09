// utils/notifications.js

const { orders } = require('./orders-memory');

function getUnreadOrders() {
  return orders.filter(order => order.unread);
}

function markOrdersAsRead() {
  orders.forEach(order => {
    if (order.unread) {
      order.unread = false;
    }
  });
}

module.exports = {
  getUnreadOrders,
  markOrdersAsRead,
};
