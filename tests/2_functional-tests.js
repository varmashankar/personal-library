/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  let book1;
  const invalidId = ObjectId();

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: 'Python'
          })
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isObject(res.body, 'response as json Object');
            assert.property(res.body, '_id', 'response should have _id');
            assert.property(res.body, 'title', 'response should have title');
            book1 = res.body;
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response should be string');
            assert.equal(res.text, 'missing required field title', 'response should have a message');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isArray(res.body, 'response should be Array of Object');
            assert.isObject(res.body[0], 'response should be Object inside Array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${invalidId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response should be String');
            assert.equal(res.text, 'no book exists', 'invalid bookid response message');
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${book1._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isObject(res.body, 'response should be Object');
            assert.property(res.body, 'commentcount', 'Books should contain commentcount');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.isArray(res.body.comments, 'comments should be array of comment');
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${book1._id}`)
          .send({
            comment: 'This book is the best!'
          })
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isObject(res.body, 'response as json Object');
            assert.property(res.body, '_id', 'response should have _id');
            assert.property(res.body, 'title', 'response should have title');
            assert.isAbove(res.body.commentcount, 0, 'commentcount should more than 0');
            assert.isArray(res.body.comments, 'comments should be array of commment');
            assert.isString(res.body.comments[0], 'first comment should be String');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${book1._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response as String');
            assert.equal(res.text, 'missing required field comment', 'response a message as no comment submit');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${invalidId}`)
          .send({
            comment: 'This book is the best'
          })
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response as String');
            assert.equal(res.text, 'no book exists', 'response a message as no data');
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${book1._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response as String');
            assert.equal(res.text, 'delete successful', 'response a message on deleted book');
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${invalidId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'api should response');
            assert.isString(res.text, 'response as String');
            assert.equal(res.text, 'no book exists', 'response a message as no data');
            done();
          })
      });

    });

  });

});
