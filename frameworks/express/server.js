const express = require('express');
const bodyParser = require('body-parser');
const messageRoutes = require('./routes/messageRoutes');
const config = require('../../config/config');

const app = express();

app.use(bodyParser.text());

// Use the message routes
app.use('/', messageRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port} in ${config.environment} mode`);
});