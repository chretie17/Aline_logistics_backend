const Stock = require('../models').Stock;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    const formattedStocks = stocks.map(stock => ({
      ...stock.dataValues,
      image: stock.image ? stock.image.toString('base64') : null,
    }));
    res.json(formattedStocks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createStock = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, category, upc, incomingRow, price, inStock, totalValue, status, description } = req.body;
      const image = req.file ? req.file.buffer : null;
      const stock = await Stock.create({ name, category, upc, incomingRow, price, inStock, totalValue, status, description, image });
      res.status(201).json({ message: 'Stock added', stock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

exports.updateStock = [
  upload.single('image'),
  async (req, res) => {
    try {
      const stock = await Stock.findByPk(req.params.id);
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
      const { name, category, upc, incomingRow, price, inStock, totalValue, status, description } = req.body;
      const image = req.file ? req.file.buffer : stock.image;
      await stock.update({ name, category, upc, incomingRow, price, inStock, totalValue, status, description, image });
      res.json({ message: 'Stock updated', stock });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    await stock.destroy();
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
