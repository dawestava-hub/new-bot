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
    console.log(`🔐 OCTO-MD Server running on port ${port}`);
    console.log(`> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐁𝐥𝐚𝐳𝐞 𝐓𝐞𝐜𝐡`);
});

module.exports = app;
