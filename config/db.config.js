const mongoose = require('mongoose');


const db = process.env.CONN;

const dbConnection = async() => {

    try {
        await mongoose.connect(db);
        console.log('Conectado con base de datos');
    } catch (error) {
        console.log('DB conection error:', error);
    }

}



module.exports = dbConnection