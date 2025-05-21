/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { default: mongoose } = require("mongoose");
const { Book } = require("../model/model");
require('dotenv').config();

const url = process.env.MONGO_URL;

// connect to mongodb
mongoose.connect(url);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      // query all books
      const data = await Book.find();
      res.json(data);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      // check title input
      if (!title) {
        res.send('missing required field title');
        return;
      };
      // add new book to database
      try {
        const newBook = new Book({
          title: title,
          commentcount: 0,
          comments: []
        });
        const savedBook = await newBook.save();
        res.json({
          _id: savedBook._id,
          title: savedBook.title
        });
        console.log('successfully add new book');
      } catch (error) {
        console.log('can not add new book:', error);
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      // delete all books
      try {
        await Book.deleteMany();
        res.send('complete delete successful');
        console.log('delete all books');
      } catch (error) {
        console.log('can not delete all books:', error)
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const exist_book = await Book.findById(bookid);
        // check exist book
        if (!exist_book) {
          res.send('no book exists');
          return;
        };
        res.json(exist_book);
      } catch (error) {
        console.log('can not find book:', error);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        // check comment
        if (!comment) {
          res.send('missing required field comment');
          return;
        };
        // get exist book
        const exist_book = await Book.findById(bookid);
        if (!exist_book) {
          res.send('no book exists');
          return;
        };
        // add comment
        exist_book.comments.push(comment);
        exist_book.commentcount++;
        const saved_comment = await exist_book.save();
        res.json(saved_comment);
        console.log(`successfully add comment to ${exist_book.title}`);
      } catch (error) {
        console.log('can not comment:', error);
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        // find exist book
        const exist_book = await Book.findById(bookid);
        if (!exist_book) {
          res.send('no book exists');
          return;
        };
        // delete exist book
        await Book.deleteOne({ _id: bookid });
        res.send('delete successful');
        console.log(`successfully delete book: ${exist_book.title}`);
      } catch (error) {
        console.log('can not delete:', error);
      }
    });

};
