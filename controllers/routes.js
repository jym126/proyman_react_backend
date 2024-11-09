const Project = require('../models/models')

const home = (req, res) => {
    res.send('Welcome home');
};

// Rutas para CRUD
const allProjects = async (req, res) => {
    try {        
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.log(error);
    }
  };
  
  const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.json(project);
    } catch (error) {
        console.log(error);
    }
  };
  
  const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findOneAndUpdate({ _id: id }, req.body, { new: true });
        res.json(project);
    } catch (error) {
        console.log(error);
    }
  };
  
  const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findOneAndDelete({ _id: id });
        res.json({ message: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error)
    }
  };


module.exports = {
    home, allProjects, createProject, updateProject, deleteProject
};