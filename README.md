# NORTHCODERS NEWS - backend
Backend of the Reddit clone project. Built using Node.js, Express.js, MongoDB, Mongoose

**Getting Started**

First, ensure you have Node v7.9.0 installed

then

    git clone https://github.com/SDMoxon/northcoders-news-backend.git

    cd northcoders-news-backend

    npm install

    npm start

To run the tests:

    npm test

Built With

- Javascript
- Express.js
- MongoDB
- Mongoose

**List of Available Routes**

GET    
- /api/topics
- /api/articles
- /api/users/:username
- /topics/:topic_id/articles
- /articles/:article_id/comments

POST

- /articles/:article_id/comments

PUT

- /articles/:article_id
- /comments/:comment_id
