const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config');

const app = express();
app.use(bodyParser.json());
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true
  };
  
  app.use(cors(corsOptions));
  

app.use('/api/courses', require('./routes/courses'));
app.use('/api/blogs', require('./routes/blogs'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
