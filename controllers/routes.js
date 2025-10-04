const Project = require('../models/models');

// Home
const home = (req, res) => res.send('Welcome home');

// ---- Proyectos ----
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
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- Tareas ----
const addTask = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    project.tasks.push(req.body);
    await project.save();
    res.json({ project });
  } catch (err) {
    console.error("Error agregando tarea:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    Object.assign(task, req.body);
    await project.save();
    res.json({ project });
  } catch (err) {
    console.error("Error actualizando tarea:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Filtrar la tarea eliminada
    const taskExists = project.tasks.some(task => task._id.toString() === taskId);
    if (!taskExists) return res.status(404).json({ error: 'Tarea no encontrada' });

    project.tasks = project.tasks.filter(task => task._id.toString() !== taskId);
    await project.save();

    res.json({ message: 'Tarea eliminada correctamente', project });
  } catch (err) {
    console.error("Error eliminando tarea:", err);
    res.status(500).json({ error: 'Error eliminando la tarea' });
  }
};

module.exports = {
  home,
  allProjects,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask
};