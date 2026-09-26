const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'blog-secret-key';
const dbPath = path.join(__dirname, 'blog.db');
const db = new Database(dbPath);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const initializeDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      userId INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(postId) REFERENCES posts(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
};

initializeDatabase();

const normalizeUser = (user) => ({
  id: user.id,
  username: user.username,
});

const createToken = (user) => jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

const getUserFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const payload = getUserFromToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  req.user = user;
  next();
};

const getPostComments = (postId) =>
  db
    .prepare(
      `SELECT c.id, c.content, c.createdAt, c.userId, u.username AS author
       FROM comments c
       JOIN users u ON u.id = c.userId
       WHERE c.postId = ?
       ORDER BY c.createdAt ASC`
    )
    .all(postId);

const formatPost = (post) => ({
  id: post.id,
  title: post.title,
  content: post.content,
  userId: post.userId,
  username: post.username,
  createdAt: post.createdAt,
  comments: getPostComments(post.id),
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Blog API is running.' });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
    return res.status(400).json({ message: 'Username must be between 3 and 24 characters.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(trimmedUsername.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: 'Username is already taken.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)').run(trimmedUsername.toLowerCase(), passwordHash);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = createToken(user);

  return res.status(201).json({
    token,
    user: normalizeUser(user),
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = createToken(user);
  return res.json({
    token,
    user: normalizeUser(user),
  });
});

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: normalizeUser(req.user) });
});

app.get('/api/posts', (req, res) => {
  const posts = db
    .prepare(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON u.id = p.userId
       ORDER BY p.createdAt DESC`
    )
    .all();

  const payload = posts.map((post) => formatPost(post));
  res.json({ posts: payload });
});

app.get('/api/posts/:id', (req, res) => {
  const post = db
    .prepare(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON u.id = p.userId
       WHERE p.id = ?`
    )
    .get(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  return res.json({ post: formatPost(post) });
});

app.post('/api/posts', authenticate, (req, res) => {
  const { title, content } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({ message: 'Title and content cannot be empty.' });
  }

  const result = db
    .prepare('INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)')
    .run(trimmedTitle, trimmedContent, req.user.id);

  const createdPost = db
    .prepare(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON u.id = p.userId
       WHERE p.id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json({ post: formatPost(createdPost) });
});

app.put('/api/posts/:id', authenticate, (req, res) => {
  const { title, content } = req.body || {};
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only edit your own posts.' });
  }

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({ message: 'Title and content cannot be empty.' });
  }

  db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').run(trimmedTitle, trimmedContent, req.params.id);

  const updatedPost = db
    .prepare(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON u.id = p.userId
       WHERE p.id = ?`
    )
    .get(req.params.id);

  return res.json({ post: formatPost(updatedPost) });
});

app.delete('/api/posts/:id', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own posts.' });
  }

  db.prepare('DELETE FROM comments WHERE postId = ?').run(req.params.id);
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);

  return res.json({ message: 'Post deleted successfully.' });
});

app.post('/api/posts/:id/comments', authenticate, (req, res) => {
  const { content } = req.body || {};
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment content is required.' });
  }

  const result = db
    .prepare('INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)')
    .run(req.params.id, req.user.id, content.trim());

  const createdComment = db
    .prepare(
      `SELECT c.*, u.username AS author
       FROM comments c
       JOIN users u ON u.id = c.userId
       WHERE c.id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json({ comment: createdComment });
});

app.delete('/api/comments/:id', authenticate, (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own comments.' });
  }

  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  return res.json({ message: 'Comment deleted successfully.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Blog API listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, db };
