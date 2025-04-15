const Task = require('../models/task');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const db = mongoose.connection.useDb('assignly');


const getAll = async (req, res, next) => {
  try {
    const result = await db.collection('tasks').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `Error fetching tasks: ${error.message}` });
  }
};


// Use professionalId from task to get a task
const getByProfessionalId = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await db.collection('tasks').find({
      professionalId: id,
    }).toArray();

    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not founded with this professional!' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = new Task(taskData);  
    await newTask.validate();
    const savedTask = await db.collection('tasks').insertOne(newTask);

    res.status(201).json({
      message: 'Task creating sucessfully!',
      task: savedTask
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate task by id
    const existingTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not founded!' });
    }    

    // Update task
    const updatedTask = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: 'Task update sucessfully!',
      task: updatedTask.value
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const existingUser = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      return res.status(404).json({ message: 'Task not founded!' });
    }

    // Delete the user
    await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: `Error deleting task: ${error.message}` });
  }
};

// Toggle the 'active' status of a task
const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Task by ID
    const existingTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    // Toggle 'active' status
    const updatedTask = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { active: !existingTask.active } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `Task ${updatedTask.active ? 'activated' : 'deactivated'} successfully!`,
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating active status: ${error.message}` });
  }
};

// Toggle the 'deleted' status of a task
const toggleDeleted = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const existingTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    // Toggle 'deleted' status
    const updatedTask = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: !existingTask.deleted } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `Task ${updatedTask.deleted ? 'marked as deleted' : 'restored'} successfully!`,
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating deleted status: ${error.message}` });
  }
};

module.exports = { 
    getAll,
    getByProfessionalId,
    createTask,
    updateTask,
    deleteTask,
    toggleActive,
    toggleDeleted
  };