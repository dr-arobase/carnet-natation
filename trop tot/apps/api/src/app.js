const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static (for docs or simple frontend)
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

// Mount routes (to be implemented)
app.use('/api', require('./routes'));

module.exports = app;
