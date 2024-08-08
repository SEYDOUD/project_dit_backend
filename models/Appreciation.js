const mongoose = require("mongoose")
const { Schema } = mongoose;

const AppreciationSchema = new Schema({
  isAppreciate: Boolean,
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  idPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const Appreciation = mongoose.model('Appreciation', AppreciationSchema);

module.exports = {Appreciation}