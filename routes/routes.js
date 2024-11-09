const {Router} = require('express');
const { home, allProjects, createProject, updateProject, deleteProject } = require('../controllers/routes');



const route = Router();


route.get('/', home);
route.get('/projects', allProjects);
route.post('/projects', createProject);
route.put('/projects/:id', updateProject);
route.delete('/projects/:id', deleteProject);

module.exports = route;