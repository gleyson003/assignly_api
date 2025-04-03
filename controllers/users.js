const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const db = mongoose.connection.useDb('assignly');
const User = require('../models/User');

const getAll = async (req, res, next) => {
  try {
    const result = await db.collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `Error fetching users: ${error.message}` });
  }
};


// Get an array off users from name
const getByName = async (req, res, next) => {
  try {
    const name = req.params.name;

    const users = await db.collection('users').find({
      first_name: { $regex: new RegExp(name, 'i') },
      deleted: false
    }).toArray();

    if (users.length === 0) {
      return res.status(404).json({ message: 'Users not found!' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Validation email
    const existingUser = await db.collection('users').findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado!' });
    }

    const newUser = new User(userData);
    await newUser.validate();
    const savedUser = await db.collection('users').insertOne(newUser);

    res.status(201).json({
      message: 'User creating sucessfully!',
      user: savedUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate user by id
    const existingUser = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not founded!' });
    }

    // If email change, verify if it was registered before
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await db.collection('users').findOne({ email: updateData.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email já cadastrado!' });
      }
    }

    // Update user
    const updatedUser = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: 'User update sucessfully!',
      user: updatedUser.value
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = { 
    getAll,
    getByName,
    createUser,
    updateUser
  };