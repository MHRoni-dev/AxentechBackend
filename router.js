const express = require('express');
const router = express.Router();
const { getConnection } = require('./mikrotik');
const { checkIfLogin } = require('./auth');
const { createToken } = require('./token');


router.post('/login', async (req, res, next) => {
  try { 
    const { username, password } = req.body;
    if (username === process.env.MIKROTIK_USER && password === process.env.MIKROTIK_PASSWORD) {
      const token = createToken({ username });
      console.log('✅ Login successful');
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    next(error)
  }
})

// Get a list of users from MikroTik
router.get('/users',checkIfLogin, async (req, res) => {
  try {
    const connection = await getConnection();
    const response = await connection.write('/ip/hotspot/user/print', []);
    const users = response;
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Update a user on MikroTik
router.put('/users/:id',checkIfLogin, async (req, res) => {
  try {
    const connection = await getConnection();
    const userId = req.params.id;
    const { name, password } = req.body;
    console.log(req.body)
    // Update user properties
    const response = await connection.write('/ip/hotspot/user/set', [
      '=.id=' + userId,
      '=name=' + name,
      '=password=' + password
    ]);
    console.log(response)
    res.status(200).json({ message: 'User updated successfully', response });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
