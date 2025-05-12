const Task = require('../models/Task');
const { Op, fn, col, where: sequelizeWhere, literal } = require('sequelize');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const task = await Task.create({ title, description, dueDate, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { status, search } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.title = sequelizeWhere(
        fn('LOWER', col('title')),
        {
          [Op.like]: `%${search.toLowerCase()}%`
        }
      );
    }

    const tasks = await Task.findAll({ where: whereClause });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};