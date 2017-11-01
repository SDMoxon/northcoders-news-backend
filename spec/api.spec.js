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
    describe('GET /api/topics', function () {
        it('responds with an array of topics', function (done) {
            request(server)
                .get('/api/topics')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.topics).to.be.an('array');
                        expect(res.body.hasOwnProperty('topics')).to.equal(true);
                        expect(res.body.topics.length).to.equal(3);
                        done();
                    }
                });
        });
    });
    describe('GET /api/articles', function () {
        it('responds with an array of articles', function (done) {
            request(server)
                .get('/api/articles')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.articles).to.be.an('array');
                        expect(res.body.hasOwnProperty('articles')).to.equal(true);
                        expect(res.body.articles.length).to.equal(2);
                        done();
                    }
                });
        });
    });
    describe('GET /api/users/:username', function () {
        it('responds with a user matching to username supplied ', function (done) {
            request(server)
                .get('/api/users/northcoder')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.hasOwnProperty('users')).to.equal(true);
                        expect(res.body.users.length).to.equal(1);
                        expect(res.body.users[0].name).to.equal('Awesome Northcoder');
                        done();
                    }
                });
        });
    });
    describe('GET /api/topics/:topic_id/articles', function () {
        it('responds with a filtered array of articles', function (done) {
            request(server)
                .get('/api/topics/cats/articles')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.articles).to.be.an('array');
                        expect(res.body.hasOwnProperty('articles')).to.equal(true);
                        expect(res.body.articles.length).to.equal(1);
                        done();
                    }
                });
        });
    });
    describe('GET /api/articles/article_id/comments', function () {
        it('responds with a list of commments tied to an article id ', function (done) {
            request(server)
                .get(`/api/articles/${usefulData.comments[0].belongs_to}/comments`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.hasOwnProperty('comments')).to.equal(true);
                        expect(res.body.comments.length).to.equal(2);
                        expect(res.body.comments[0]._id.toString()).to.equal(usefulData.comments[0]._id.toString());
                        done();
                    }
                });
        });
    });
    describe('POST /api/articles/article_id/comments', function () {
        it('responds with the new comment ', function (done) {
          request(server)
            .post(`/api/articles/${usefulData.comments[0].belongs_to}/comments`)
            .send({
              body:'test'
            })
            .end((err, res) => {
              if (err) done(err);
              else {
                expect(res.status).to.equal(201);
                expect(res.body.body).to.eql('test');
                expect(res.body.belongs_to).to.eql(usefulData.comments[0].belongs_to.toString());
                done();
              }
            });
        });
      });
});