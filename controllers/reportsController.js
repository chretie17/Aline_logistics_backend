const { sequelize } = require('../models');

// Stock Reports

exports.getTotalStockValue = async (req, res) => {
  try {
    console.log('Fetching total stock value...');
    const [totalValue] = await sequelize.query(
      'SELECT SUM(totalValue) AS totalValue FROM Stocks'
    );
    console.log('Total stock value:', totalValue[0].totalValue);
    res.json({ totalValue: totalValue[0].totalValue });
  } catch (error) {
    console.error('Error fetching total stock value:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getStockByCategory = async (req, res) => {
  try {
    console.log('Fetching stock grouped by category...');
    const [stockByCategory] = await sequelize.query(
      'SELECT category, SUM(totalValue) AS totalValue FROM Stocks GROUP BY category'
    );
    console.log('Stock by category:', stockByCategory);
    res.json({ data: stockByCategory });
  } catch (error) {
    console.error('Error fetching stock by category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Order Reports

exports.getOrderStatusCounts = async (req, res) => {
  try {
    console.log('Fetching order status counts...');
    const [statusCounts] = await sequelize.query(
      'SELECT status, COUNT(status) AS count FROM Orders GROUP BY status'
    );
    console.log('Order status counts:', statusCounts);
    res.json({ data: statusCounts });
  } catch (error) {
    console.error('Error fetching order status counts:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersToday = async (req, res) => {
  try {
    console.log('Fetching orders created today...');
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [ordersToday] = await sequelize.query(
      `SELECT * FROM Orders WHERE createdAt BETWEEN '${startOfToday.toISOString()}' AND '${endOfToday.toISOString()}'`
    );
    console.log('Orders today:', ordersToday);
    res.json({ data: ordersToday });
  } catch (error) {
    console.error('Error fetching orders created today:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyOrders = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    console.log(`Fetching monthly orders for year: ${year}...`);

    const [monthlyOrders] = await sequelize.query(
      `SELECT MONTH(createdAt) AS month, COUNT(id) AS orderCount 
       FROM Orders 
       WHERE createdAt BETWEEN '${year}-01-01' AND '${year}-12-31'
       GROUP BY MONTH(createdAt)
       ORDER BY month ASC`
    );
    console.log('Monthly orders:', monthlyOrders);
    res.json({ data: monthlyOrders });
  } catch (error) {
    console.error('Error fetching monthly orders:', error);
    res.status(500).json({ error: error.message });
  }
};

// Driver Reports

exports.getDriverPerformance = async (req, res) => {
  try {
    console.log('Fetching driver performance...');
    const [performance] = await sequelize.query(
      `SELECT Users.name AS driverName, COUNT(Orders.id) AS orderCount 
       FROM Orders 
       INNER JOIN Users ON Orders.driverId = Users.id
       WHERE Orders.status = 'Order Delivered' 
       GROUP BY Orders.driverId`
    );
    console.log('Driver performance:', performance);
    res.json({ data: performance });
  } catch (error) {
    console.error('Error fetching driver performance:', error);
    res.status(500).json({ error: error.message });
  }
};
