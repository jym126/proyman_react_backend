const { Router } = require('express');
const { 
  home, allProjects, createProject, updateProject, deleteProject,
  addTask, updateTask, deleteTask, uploadImage, uploadMiddleware
} = require('../controllers/routes');

const route = Router();
// --- imágenes ---
route.post('/projects/upload', uploadMiddleware, uploadImage);

route.get('/home', home);
route.get('/projects', allProjects);
route.post('/projects', createProject);
route.put('/projects/:id', updateProject);
route.delete('/projects/:id', deleteProject);

// --- tareas ---
route.post('/projects/:id/tasks', addTask);
route.put('/projects/:id/tasks/:taskId', updateTask);
route.delete('/projects/:id/tasks/:taskId', deleteTask);


module.exports = route;
