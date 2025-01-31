// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://frontend-test-run.vercel.app/', // Allow frontend URL from .env
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(error => console.error('❌ MongoDB Connection Error:', error.message));

// Mongoose Schema and Model
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  message: { type: String, required: true },
});

const Form = mongoose.model('Form', formSchema);

// API Routes

// Save form data
app.post('/api/save', async (req, res) => {
  try {
    const formData = new Form(req.body);
    await formData.save();
    res.status(201).json({ message: '✅ Form submitted successfully!' });
  } catch (error) {
    console.error('❌ Error saving form data:', error);
    res.status(500).json({ message: '❌ Failed to save form data.', error: error.message });
  }
});

// Retrieve all form data
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('❌ Error retrieving form data:', error);
    res.status(500).json({ message: '❌ Failed to fetch form data.', error: error.message });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 Backend is running successfully!');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
