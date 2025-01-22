const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://frontend-test-run.vercel.app', // Your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); // Apply CORS configuration
app.use(express.json());

// Define a schema and model
const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Form = mongoose.model('Form', formSchema, 'forms'); // Explicitly set collection name


// Routes
app.post('/api/save', async (req, res) => {
  const { name, email, phone, address, message } = req.body;

  try {
    const form = new Form({ name, email, phone, address, message });
    await form.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving form data', error: error.message });
  }
});

// Simple GET route for testing
app.get('/', (req, res) => {
  res.send('Server is running on port');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
