const express = require("express");
const mongoose = require("mongoose");

const db = require('./config/keys').mongoURI;
const PORT = process.env.PORT || 5000;

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

const app = express();

mongoose.connect(db)
.then(() => console.log(`Connected to db at: ${db}`))
.catch((err) => console.log(err))

app.get('/', (req, res) => res.send("Hello WOrld"));

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profiles', profiles);

app.listen(PORT, console.log(`Server running on port: ${PORT}`));