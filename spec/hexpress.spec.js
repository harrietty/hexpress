const {expect} = require('chai');
const request = require('supertest');
// const http = require('http');
const PORT = 3001;

const Hexpress = require('../index');

describe('Hexpress', function () {
  let server, app;
  before(done => {
    app = new Hexpress();
    server = app.listen(PORT, done);
  });
  after(done => {
    server.close(done);
  });
  describe('An instance of hexpress()', function () {
    it('has a listen method', function () {
      expect(app.listen).to.be.a('function');
    });
    it('can listen for incoming requests', function (done) {
      request(server) // testing for app creates a new Http app in supertest and runs through all the methods on http.Server
        .get('/')
        .expect(404)
        .end((err, res) => {
          expect(res.text).to.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /</pre>\n</body>\n</html>');
          done();
        });
    });
    it('responds with cannot GET on any path', function (done) {
      request(server) // testing for app creates a new Http app in supertest and runs through all the methods on http.Server
        .get('/test/path')
        .expect(404)
        .end((err, res) => {
          expect(res.text).to.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /test/path</pre>\n</body>\n</html>');
          done();
        });
    });
    it('responds with cannot METHOD on any path', function (done) {
      request(server) // testing for app creates a new Http app in supertest and runs through all the methods on http.Server
        .post('/test/path')
        .expect(404)
        .end((err, res) => {
          expect(res.text).to.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /test/path</pre>\n</body>\n</html>');
          done();
        });
    });
  });
  describe('app.get()', () => {
    it('adds a handler to the specified route', done => {
      app.get('/', (req, res) => {
        res.status(201).send('fooo!');
      });
      request(server)
        .get('/')
        .expect(201)
        .end((err, res) => {
          expect(res.text).to.equal('fooo!');
          done();
        });
    });
  });
});