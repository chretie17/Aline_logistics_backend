const express = require('express');
const sequelize = require('./models/index').sequelize;
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
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
const StockDash =require('./routes/stockDash');
const Drivers = require('./routes/driverRoutes');
const Reportsroutes = require('./routes/reportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dash', StockDash);
app.use('/api/drivers', Drivers);
app.use('/api/reports', Reportsroutes);

sequelize.sync({ alter: true }).then(() => { // alter: true ensures models update automatically
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
