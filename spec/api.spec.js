process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../server');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;


describe('Authentication', () => {
    it('should respond with a 200 if login is successful', (done) => {
        request
            .post('/login')
            .send({ username: 'northcoder', password: 'password' })
            .end((err, res) => {
                if (err) done(err);
                else {
                    expect(res.status).to.equal(200);

                    done();
                }
            });
    });
    it('should not respond with a 500 if login is unsuccessful', (done) => {
        request
            .post('/login')
            .send({ username: 'northcoder', password: 'testing' })
            .end((err, res) => {
                if (err) done(err);
                else {
                    expect(res.status).to.equal(500);
                    done();
                }
            });
    });
});

describe('API', function () {
    let usefulData;
    beforeEach(done => {
        mongoose.connection.dropDatabase()
            .then(saveTestData)
            .then(data => {
                usefulData = data;
                done();
            })
            .catch(done);

    });

    describe('GET /', function () {
        it('responds with status code 200', (done) => {
            request
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
            request
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
            request
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
            request
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
            request
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
            request
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
            request
                .get(`/api/articles/${usefulData.comments[0].belongs_to}/comments`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.hasOwnProperty('comments')).to.equal(true);
                        expect(res.body.comments.length).to.equal(2);
                        expect(res.body.comments[0].belongs_to.toString()).to.equal(usefulData.comments[0].belongs_to.toString());
                        done();
                    }
                });
        });
    });
    describe('POST /api/articles/article_id/comments', function () {
        it('responds with the new comment ', function (done) {
            const articleId = usefulData.comments[0].belongs_to;
            request
                .post(`/api/articles/${articleId}/comments`)
                .send({
                    body: 'test'
                })
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(201);
                        expect(res.body.body).to.eql('test');
                        expect(res.body.belongs_to.toString()).to.equal(articleId.toString());
                        done();
                    }
                });
        });
    });
    describe('PUT /api/articles/article_id', function () {
        it('responds with increased votes ', function (done) {
            const previous = usefulData.articles[0];
            request
                .put(`/api/articles/${usefulData.articles[0]._id}?vote=up`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(201);
                        expect(res.body._id).to.equal(previous._id.toString());
                        expect(res.body.votes).to.equal(previous.votes + 1);
                        done();
                    }
                });
        });
    });
    describe('PUT /api/comments/:commentId', function () {
        it('responds with increased votes ', function (done) {
            const previous = usefulData.comments[0];
            request
                .put(`/api/comments/${usefulData.comments[0]._id}?vote=up`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(201);
                        expect(res.body._id).to.equal(previous._id.toString());
                        expect(res.body.votes).to.equal(previous.votes + 1);
                        done();
                    }
                });
        });
    });
    describe('DELETE /api/comments/:commentId', function () {
        it('responds with status 200 and the comment if comment is found and delelted', function (done) {
            request
                .delete(`/api/comments/${usefulData.comments[0]._id}`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body._id).to.equal(usefulData.comments[0]._id.toString());
                        done();
                    }
                });
        });
    });
});
