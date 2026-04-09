const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pairRouter = require('./sila');
app.use('/', pairRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`> MADE IN BY INCONNU BOY`);
});

module.exports = app;
