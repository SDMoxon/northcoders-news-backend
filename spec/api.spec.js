process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

describe('API', function () {
    this.timeout(5000);
    let usefulData;
    beforeEach(done => {
      mongoose.connection.dropDatabase()
        .then(saveTestData)
        .then(data => {
          usefulData = data;
          console.log(usefulData.user.username);
          done();
        })
        .catch(done);
    });
    describe('GET /', function () {
        it('responds with status code 200', (done) => {
            request(server)
                .get('/')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        done();
                    }
                });
        });
    });
    describe('GET /api', function () {
        it('responds with status code 200', function (done) {
            request(server)
                .get('/api')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        done();
                    }
                });
        });
    });
});