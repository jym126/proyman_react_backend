const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  progress: { type: Number, default: 0 } // porcentaje completado
});

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    tasks: [TaskSchema] // <-- tareas para gantt
  },
  { timestamps: true }
);

module.exports = model('Project', ProjectSchema);
