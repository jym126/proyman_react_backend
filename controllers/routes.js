const Project = require('../models/models')

const home = (req, res) => res.send('Welcome home');

const allProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findOneAndDelete({ _id: id });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------- TAREAS --------
const addTask = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    project.tasks.push(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const project = await Project.findById(id);
    const task = project.tasks.id(taskId);
    Object.assign(task, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const project = await Project.findById(id);
    project.tasks.id(taskId).remove();
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  home, allProjects, createProject, updateProject, deleteProject,
  addTask, updateTask, deleteTask
};
