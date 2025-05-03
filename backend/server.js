const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect("mongodb+srv://dasunathauda99:QYaZclvaFXKLVy49@countries-app.kmeoz0j.mongodb.net/?retryWrites=true&w=majority&appName=countries-app")
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => {
      console.log(`Server running on port 5000`);
    });
  })
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Railway backend is running...');
});
