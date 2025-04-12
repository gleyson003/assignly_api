const TaskType = require('../models/task_types');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const db = mongoose.connection.useDb('assignly');


// Get an array off all task-types
const getAll = async (req, res, next) => {
  try {
    const result = await db.collection('task_types').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `Error fetching tasks: ${error.message}` });
  }
};

// Get an array off task-types from name
const getByName = async (req, res, next) => {
  try {
    const name = req.params.name;

    const taskType = await db.collection('task_types').find({
      name: { $regex: new RegExp(name, 'i') },
      deleted: false
    }).toArray();

    if (taskType.length === 0) {
      return res.status(404).json({ message: 'Task-type not founded!' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(taskType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Creating new task-types
const createTaskTypes = async (req, res) => {
  try {
    const data = req.body;

    // Validation task-type
    const existingTaskType = await db.collection('task_types').findOne({
      name: { $regex: `^${data.name}$`, $options: 'i' }
    });
    
    if (existingTaskType) {
      return res.status(400).json({ message: 'The task-type has already been registered previously!' });
    }

    const newTaskType = new TaskType(data);
    await newTaskType.validate();
    const savedTaskType = await db.collection('task_types').insertOne(newTaskType);

    res.status(201).json({
      message: 'Task-type creating sucessfully!',
      TaskType: savedTaskType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTaskTypes = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate Task by id
    const existingTaskTypeId = await db.collection('task_types').findOne({ _id: new ObjectId(id) });
    if (!existingTaskTypeId) {
      return res.status(404).json({ message: 'Task-type not founded!' });
    }

    // Validation user-type name
    const existingTaskTypeName = await db.collection('task_types').findOne({
      name: { $regex: `^${updateData.name}$`, $options: 'i' }
    });

    if (existingTaskTypeName) {
      return res.status(400).json({ message: "The task-type's name is already registered!" });
    }

    // Update task
    const updatedTaskType = await db.collection('task_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: 'Task-type update sucessfully!',
      TaskType: updatedTaskType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dropTaskTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the task-type exists
    const existingTaskType = await db.collection('task_types').findOne({ _id: new ObjectId(id) });
    if (!existingTaskType) {
      return res.status(404).json({ message: 'Task-type not found!' });
    }

    // Drop the task-type
    await db.collection('task_types').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'Task-type drop successfully!', taskType: id });
  } catch (error) {
    res.status(500).json({ error: `Error dropping task-type: ${error.message}` });
  }
};

// Toggle the 'active' status of a task
const activeTaskTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const existingTaskType = await db.collection('task_types').findOne({ _id: new ObjectId(id) });
    if (!existingTaskType) {
      return res.status(404).json({ message: 'Task-type not founded!' });
    }

    // Toggle 'active' status
    const updatedTaskType = await db.collection('task_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { active: !existingTaskType.active } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `Task-type ${updatedTaskType.active ? 'activated' : 'deactivated'} successfully!`,
      TaskType: updatedTaskType
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating active status: ${error.message}` });
  }
};

// Toggle the 'deleted' status of a task-type
const deletedTaskTypes = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const existingTaskType = await db.collection('task_types').findOne({ _id: new ObjectId(id) });
    if (!existingTaskType) {
      return res.status(404).json({ message: 'Task-types not found!' });
    }

    // Toggle 'deleted' status
    const updatedTaskType = await db.collection('task_types').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: !existingTaskType.deleted } },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: `Task-type ${updatedTaskType.deleted ? 'marked as deleted' : 'restored'} successfully!`,
      taskType: updatedTaskType
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating deleted status: ${error.message}` });
  }
};


module.exports = { 
    getAll,
    getByName,
    createTaskTypes,
    updateTaskTypes,
    dropTaskTypes,
    activeTaskTypes,
    deletedTaskTypes
  };