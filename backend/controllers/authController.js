const User = require('../models/user');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Register User
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.status(201).json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = createToken(user._id);
    res.status(200).json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
