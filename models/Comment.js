const mongoose = require("mongoose")
const { Schema } = mongoose;

const CommentSchema = new Schema({
  message: String,
  status: String,
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  idPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment}