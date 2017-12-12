const { expect } = require('chai');
const request = require('supertest');
const { json } = require('body-parser');
const PORT = 3000;

const Hexpress = require('../index');

describe('Hexpress', function () {
  let server, app;
  beforeEach(done => {
    app = new Hexpress();
    server = app.listen(PORT, done);
  });
  afterEach(done => {
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
    it('adds a handler to api/jinxes', function (done) {
      app.get('/api/jinxes', (req, res) => {
        res.status(200).send('On the api/jinxes endpoint');
      });
      request(server)
        .get('/api/jinxes')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('On the api/jinxes endpoint');
          done();
        });
    });
    it('adds a handler to /api/spells', function (done) {
      app.get('/api/spells', (req, res) => {
        res.status(200).send('On the api/spells endpoint');
      });
      request(server)
        .get('/api/spells')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('On the api/spells endpoint');
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
    it('adds a handler to /api', function (done) {
      app.post('/api', (req, res) => {
        res.status(200).send('Post to the API endpoint');
      });
      request(server)
        .post('/api')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Post to the API endpoint');
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
    it('adds a handler to /api', function (done) {
      app.put('/api', (req, res) => {
        res.status(200).send('Put on the API endpoint');
      });
      request(server)
        .put('/api')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Put on the API endpoint');
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
  describe('app.all()', function () {
    it('adds a handler to a route that is called for any request methods', function (done) {
      app.put('/potions', (req, res) => {
        res.status(500).send('foo');
      });
      app.all('/wizards', (req, res) => {
        res.status(201).send('Abra Cadabra!');
      });
      request(server)
        .get('/wizards')
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.text).to.equal('Abra Cadabra!');
          request(server)
            .post('/wizards')
            .end((err, res) => {
              expect(res.status).to.equal(201);
              expect(res.text).to.equal('Abra Cadabra!');
              done();
            });
        });
    });
  });
  describe('app.use()', function () {
    it('allows the use of custom middleware', function (done) {
      app.use((req, res, next) => {
        res.someProp = 'foo';
        next();
      });
      app.get('/api', (req, res) => {
        res.status(200).send(res.someProp);
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.text).to.equal('foo');
          done();
        });
    });
    it('works with third party middlewares', function (done) {
      app.use(json());
      app.post('/api', (req, res) => {
        res.status(200).send({foo: req.body.sometext});
      });
      request(server)
        .post('/api')
        .send({sometext: 'Foo!'})
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({foo: 'Foo!'});
          done();
        });
    });
    it('passes the req and res through multiple custom middlewares in the correct order', function (done) {
      app.use((req, res, next) => {
        res.someProp = 'foo2';
        res.other = 'cauldron';
        next();
      });
      app.get('/api', (req, res) => {
        res.status(200).send(`${res.someProp}, ${res.other}`);
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.text).to.equal('foo2, cauldron');
          done();
        });
    });
    it('jumps to the default error handler if an error occurs in custom middleware', function (done) {
      app.use((req, res, next) => {
        next('some error');
      });
      app.get('/api', (req, res) => {
        res.status(200).send('Nothing');
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api</pre>\n</body>\n</html>');
          done();
        });
    });
    it('jumps to the default error handler if error occurs in endpoint middleware', function (done) {
      app.get('/api', (req, res, next) => {
        next('Some error');
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api</pre>\n</body>\n</html>');
          done();
        });
    });
    it('allows the addition of custom error handling middleware', function (done) {
      app.get('/api', (req, res, next) => {
        next('Some error happened');
      });
      app.use((err, req, res, next) => {
        res.status(500).send(err);
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal('Some error happened');
          done();
        });
    });
    it('allows a chain of custom error handling middlewares', function (done) {
      app.get('/api', (req, res, next) => {
        next('Some error happened');
      });
      app.use((err, req, res, next) => {
        next(err + ' again');
      });
      app.use((err, req, res, next) => {
        res.status(501).send(err);
      });
      request(server)
        .get('/api')
        .end((err, res) => {
          expect(res.status).to.equal(501);
          expect(res.text).to.equal('Some error happened again');
          done();
        });
    });
  });
  describe('parameterised routing', function () {
    it('adds a handler to /api/spells/:id', function (done) {
      app.get('/api/spells/:id', (req, res) => {
        res.status(200).send('Spell with an ID');
      });
      request(server)
        .get('/api/spells/5')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Spell with an ID');
          done();
        });
    });
    it('adds a handler to /api/:spelltype/:id', function (done) {
      app.get('/api/:spelltype/:id', (req, res) => {
        res.status(200).send('Spell with a type and name');
      });
      request(server)
        .get('/api/hexes/6')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Spell with a type and name');
          done();
        });
    });
    it('makes a params object available on the req object', function (done) {
      app.post('/api/spells/:id/foo/:name', (req, res) => {
        res.status(200).send(`Post id ${req.params.id}, name ${req.params.name}`);
      });
      request(server)
        .post('/api/spells/6/foo/toad')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('Post id 6, name toad');
          done();
        });
    });
  });
  describe('url queries', function () {
    it('supports a single url query on a GET request', function (done) {
      app.get('/api/cauldrons', (req, res) => {
        if (req.query.color === 'black') res.status(200).send('One black cauldron');
      });
      request(server)
        .get('/api/cauldrons?color=black')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('One black cauldron');
          done();
        });
    });
    it('supports a more than 1 url query on a GET request', function (done) {
      app.get('/api/cauldrons', (req, res) => {
        if (req.query.color === 'black' && req.query.price === '1') {
          res.status(200).send('One black cauldron for £1');
        }
      });
      request(server)
        .get('/api/cauldrons?color=black&price=1')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('One black cauldron for £1');
          done();
        });
    });
    it('supports a more than 1 url query on a DELETE request', function (done) {
      app.delete('/api/cauldrons', (req, res) => {
        if (req.query.color === 'black' && req.query.price === '1') {
          res.status(200).send('One black cauldron deleted');
        }
      });
      request(server)
        .delete('/api/cauldrons?color=black&price=1')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.equal('One black cauldron deleted');
          done();
        });
    });
  
  });
  describe('res methods', function () {
    describe('res.send()', function () {
      it('can send a JSON string', function (done) {
        app.get('/', (req,res) => {
          res.status(200).send({a: 400});
        });
        request(server)
          .get('/')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({a: 400});
            done();
          });
      });
    });
  });
});