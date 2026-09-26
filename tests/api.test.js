const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const dbPath = path.join(__dirname, '..', 'blog.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const { app } = require('../server');

test('registers a user and returns token', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ username: 'alice', password: 'secret123' });

  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.username, 'alice');
});

test('creates, lists, and comments on a post', async () => {
  const login = await request(app)
    .post('/api/login')
    .send({ username: 'alice', password: 'secret123' });

  const token = login.body.token;

  const create = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My first post', content: 'Hello world!' });

  assert.equal(create.status, 201);
  assert.equal(create.body.post.title, 'My first post');

  const list = await request(app)
    .get('/api/posts');

  assert.equal(list.status, 200);
  assert.ok(list.body.posts.some((post) => post.title === 'My first post'));

  const comment = await request(app)
    .post(`/api/posts/${create.body.post.id}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ content: 'Nice article!' });

  assert.equal(comment.status, 201);
  assert.equal(comment.body.comment.content, 'Nice article!');
});
