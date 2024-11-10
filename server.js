const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const dbConnection  = require('./config/db.config'); //Database connection


const app = express();
app.use(cors({
    origin: "*"
}));

const port = process.env.PORT || 4000;
dbConnection(); //execute db connection


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(routes);

app.listen(port, ()=> {
    console.log(`Corriendo en puerto port ${port}`);
});