const { Schema, model } = require('mongoose');

const ProjectSchema = Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
    }

},

{ timestamps: true }

);

module.exports = model('Project', ProjectSchema);