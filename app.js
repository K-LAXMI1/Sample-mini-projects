const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/practices', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  email: { type: String, Unique: true },
  password: String,
  contact: { type: Number, Unique: true }
});

const User = mongoose.model('User', userSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/table', async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error('No users found');
    else res.render('table', { data: users });
  } catch (err) {
    res.status(400).json({ msg: "ERROR" });
  }
});

app.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      contact: req.body.contact

    });
    const user = await newUser.save();
    if (!user) throw Error('Something went wrong while saving the user');
    else res.status(200).json({ msg: "SUCCESSFULLY REGISTERED IN DB " });
  } catch (err) {
    res.status(400).json({ msg: "ERROR" });
  }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
