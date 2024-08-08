const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  username: String,
  password: String,
  email: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = {User}