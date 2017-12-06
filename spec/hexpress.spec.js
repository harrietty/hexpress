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
    it('adds a handler to the home route on GET', done => {
      app.get('/', (req, res) => {
        res.status(200).send('fooo!');
      });
      request(server)
        .get('/')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('fooo!');
          done();
        });
    });
    it('adds a handler to /api', function (done) {
      app.get('/api', (req, res) => {
        res.status(200).send('On the API endpoint');
      });
      request(server)
        .get('/api')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('On the API endpoint');
          done();
        });
    });
    it('adds a handler to api/owners', function (done) {
      app.get('/api/owners', (req, res) => {
        res.status(200).send('On the api/owners endpoint');
      });
      request(server)
        .get('/api/owners')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('On the api/owners endpoint');
          done();
        });
    });
    it('adds a handler to /api/pets', function (done) {
      app.get('/api/pets', (req, res) => {
        res.status(200).send('On the api/pets endpoint');
      });
      request(server)
        .get('/api/pets')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('On the api/pets endpoint');
          done();
        });
    });
  });
  describe('app.post()', function () {
    it('adds a handler to the home route on POST', done => {
      app.post('/', (req, res) => {
        res.status(201).send('Content created');
      });
      request(server)
        .post('/')
        .expect(201)
        .end((err, res) => {
          expect(res.text).to.equal('Content created');
          done();
        });
    });
  });
  describe('app.put()', function () {
    it('adds a handler to the home route on PUT', done => {
      app.put('/', (req, res) => {
        res.status(200).send('Content updated');
      });
      request(server)
        .put('/')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Content updated');
          done();
        });
    });
  });
  describe('app.delete()', function () {
    it('adds a handler to the home route on DELETE', done => {
      app.delete('/', (req, res) => {
        res.status(200).send('Content deleted');
      });
      request(server)
        .delete('/')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Content deleted');
          done();
        });
    });
  });
});