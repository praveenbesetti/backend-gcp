    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');

    const app = express();
    app.use(cors({
      origin: '*'
    }));
    app.use(express.json());

    // 1. Connection String (Replace with your Atlas URI if using Cloud)
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; 

    mongoose.connect(mongoURI)
      .then(() => console.log('✅ Connected to MongoDB'))
      .catch(err => console.error('❌ Connection error:', err));

    // 2. Define a Schema (The "Blueprint" for your NoSQL document)
    const userSchema = new mongoose.Schema({
      title: String,
      description: String,
      createdAt: { type: Date, default: Date.now }
    });

    // 3. Create a Model
    const User = mongoose.model('User', userSchema);

    // 4. API Routes
    // GET: Fetch all users
    app.get('/api/users', async (req, res) => {
      const users = await User.find();
      res.json(users);
    });

    // POST: Add a new user
    app.post('/api/users', async (req, res) => {
      const { title,description } = req.body;
      const newUser = new User({ title: title, description: description });
      await newUser.save();
      res.status(201).json(newUser);
    });

    app.listen(5000, () => console.log('Server running on http://localhost:5000'));