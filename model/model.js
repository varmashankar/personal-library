const { default: mongoose, Schema } = require("mongoose");

// Schema
const BookSchema = new Schema({
    title: {type: String, required: true},
    commentcount: Number,
    comments: [String]
});

// Model
const Book = new mongoose.model('Book', BookSchema);

module.exports = {Book};
