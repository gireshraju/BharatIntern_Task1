const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/registrationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User model
const User = mongoose.model('User', {
  name: String,
  age: Number,
  country: String,
  gender: String,
  phone: String,
  password: String
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/registrationForm', (req, res) => {
  res.render('registrationForm');
});

app.post('/register', async (req, res) => {
  // Extract form data from request body
  const { name, age, country, gender, phone, password } = req.body;

  try {
    // Create a new user
    const newUser = new User({ name, age, country, gender, phone, password });

    // Save the user to the database
    await newUser.save();

    // Render a success page
    res.render('registrationSuccess');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
