const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");
const db = require('./config/keys').mongoURI;
const PORT = process.env.PORT || 5000;


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profiles', profiles);

mongoose.connect(db)
.then(() => console.log(`Connected to db at: ${db}`))
.catch((err) => console.log(err))

app.get('/', (req, res) => res.send("Hello WOrld"));


app.listen(PORT, console.log(`Server running on port: ${PORT}`));