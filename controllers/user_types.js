const UserType = require('../models/user_types');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const db = mongoose.connection.useDb('assignly');


// Get an array off all user-types
const getAll = async (req, res, next) => {
  try {
    const result = await db.collection('user_types').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `Error fetching user-types: ${error.message}` });
  }
};

// Get an array off user-types from name
const getByName = async (req, res, next) => {
  try {
    const name = req.params.name;

    const userType = await db.collection('user_types').find({
      name: { $regex: new RegExp(name, 'i') },
      deleted: false
    }).toArray();

    if (userType.length === 0) {
      return res.status(404).json({ message: 'User-type not founded!' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(userType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Creating new user-types
const createUserTypes = async (req, res) => {
  try {
    const data = req.body;

    // Validation user-type
    const existingUserType = await db.collection('user_types').findOne({
      name: { $regex: `^${data.name}$`, $options: 'i' }
    });
    
    if (existingUserType) {
      return res.status(400).json({ message: 'The user-type has already been registered previously!' });
    }

    const newUserType = new UserType(data);
    await newUserType.validate();
    const savedUserType = await db.collection('user_types').insertOne(newUserType);

    res.status(201).json({
      message: 'User-type creating sucessfully!',
      userType: savedUserType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserTypes = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate user by id
    const existingUserTypeId = await db.collection('user_types').findOne({ _id: new ObjectId(id) });
    if (!existingUserTypeId) {
      return res.status(404).json({ message: 'User-type not founded!' });
    }

    // Validation user-type name
    const existingUserTypeName = await db.collection('user_types').findOne({
      name: { $regex: `^${updateData.name}$`, $options: 'i' }
    });

    if (existingUserTypeName) {
      return res.status(400).json({ message: "The user-type's name is already registered!" });
    }

    // Update user
    const updatedUserType = await db.collection('user_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: 'User-types update sucessfully!',
      userType: updatedUserType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dropUserTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user-type exists
    const existingUserType = await db.collection('user_types').findOne({ _id: new ObjectId(id) });
    if (!existingUserType) {
      return res.status(404).json({ message: 'User-type not found!' });
    }

    // Drop the user-type
    await db.collection('user_types').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'User-type drop successfully!', userType: id });
  } catch (error) {
    res.status(500).json({ error: `Error dropping user-type: ${error.message}` });
  }
};

// Toggle the 'active' status of a user
const activeUserTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const existingUserType = await db.collection('user_types').findOne({ _id: new ObjectId(id) });
    if (!existingUserType) {
      return res.status(404).json({ message: 'User-type not founded!' });
    }

    // Toggle 'active' status
    const updatedUserType = await db.collection('user_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { active: !existingUserType.active } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `User-type ${updatedUserType.active ? 'activated' : 'deactivated'} successfully!`,
      userType: updatedUserType
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating active status: ${error.message}` });
  }
};

// Toggle the 'deleted' status of a user-type
const deletedUserTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const existingUserType = await db.collection('user_types').findOne({ _id: new ObjectId(id) });
    if (!existingUserType) {
      return res.status(404).json({ message: 'User-types not found!' });
    }

    // Toggle 'deleted' status
    const updatedUserType = await db.collection('user_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: !existingUserType.deleted } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `User ${updatedUserType.deleted ? 'marked as deleted' : 'restored'} successfully!`,
      userType: updatedUserType
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating deleted status: ${error.message}` });
  }
};


module.exports = { 
    getAll,
    getByName,
    createUserTypes,
    updateUserTypes,
    dropUserTypes,
    activeUserTypes,
    deletedUserTypes
  };