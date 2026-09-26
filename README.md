# Blog Platform with Comments

A full-stack blog application where users can register, log in, create posts, edit or delete their content, and leave comments on blog posts.

## Features

- User registration and authentication
- Secure password hashing
- Create, update, and delete blog posts
- Comment system for user interaction
- RESTful API with SQLite database persistence
- Simple responsive frontend

## Tech stack

- Node.js
- Express
- SQLite with better-sqlite3
- JWT for authentication
- Vanilla JavaScript frontend

## Run locally

1. Install dependencies:
   npm install
2. Start the server:
   npm start
3. Visit http://localhost:3000 in your browser

## API overview

- POST /api/register
- POST /api/login
- GET /api/me
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
- POST /api/posts/:id/comments
- DELETE /api/comments/:id

## Notes

The app stores its database in a local SQLite file named blog.db in the project root.
