const Project = require('../models/models');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

// --- Configuración de Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'proyman',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    resource_type: 'auto', // <--- FUNDAMENTAL para evitar el Timeout
    transformation: [{ width: 1000, crop: "limit" }] // <--- RECOMENDADO: Redimensiona antes de subir para que pese menos
  },
});

const upload = multer({ storage });

// --- Helpers para Cloudinary ---
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {
    return null;
  }
};

const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Eliminado de Cloudinary: ${publicId}`);
    } catch (err) {
      console.error(`Error eliminando ${publicId}:`, err);
    }
  }
};

// ---- Controladores ----

const home = (req, res) => res.send('Welcome home');

const allProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nuevo: Subida de imagen
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: req.file.path });
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
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // 1. Buscar imágenes en la descripción antes de borrar
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(project.description)) !== null) {
      const imageUrl = match[1];
      if (imageUrl.includes('cloudinary')) {
        await deleteFromCloudinary(imageUrl);
      }
    }

    // 2. Borrar de la base de datos
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Proyecto e imágenes eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- Tareas (Sin cambios necesarios) ----
const addTask = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    project.tasks.push(req.body);
    await project.save();
    res.json({ project });
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    project.tasks = project.tasks.filter(task => task._id.toString() !== taskId);
    await project.save();
    res.json({ message: 'Tarea eliminada correctamente', project });
  } catch (err) {
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
  deleteTask,
  uploadImage,
  uploadMiddleware: upload.single('image')
};