const mongoose = require("mongoose")
const { Schema } = mongoose;

const PostSchema = new Schema({
  message: String,
  img: String,
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  appreciations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appreciation' }]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = {Post}