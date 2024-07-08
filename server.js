const express = require('express');
const cors = require('cors'); // Import cors
const sequelize = require('./models/index').sequelize;
const app = express();
const port = 3000;

app.use(cors()); // Use cors middleware
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transportRoutes = require('./routes/transportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/admin', adminRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
