# Blog Platform with Comments

A full-stack blogging platform built with React, Express, and MongoDB. Users can register, log in, create blog posts, edit their content, and add comments to posts.

## Features

- User authentication with JWT and cookies
- Create, read, update, and delete blog posts
- Comment on blog posts
- Responsive modern UI
- Search posts from the homepage
- GitHub Pages-friendly frontend routing setup
- Separate API and frontend deployment structure

## Tech Stack

- Frontend: React + Vite + React Router
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + cookie-based session handling

## Project Structure

- `backend/` — Express API and MongoDB models/routes
- `frontend/` — React app and static frontend build
- `.github/workflows/` — GitHub Actions deployment workflow

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection
- Git

## Local Setup

1. Start MongoDB locally.

   Example with Docker:

   ```bash
   docker run -d -p 27017:27017 --name blog-mongo mongo:latest
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Configure backend environment variables.

   The project includes a backend `.env` file with:

   ```env
   PORT=5000
   MONGO_URL=mongodb://127.0.0.1:27017/blogapp
   SECRET=blogsecret
   ```

5. Start the backend:

   ```bash
   cd backend
   npm start
   ```

6. Start the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

7. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

## Frontend API Configuration

The frontend reads its API base from environment variables in `frontend/.env`:

```env
VITE_URL="http://localhost:5000"
VITE_IF="http://localhost:5000/images/"
```

For production deployments, update the values in `frontend/.env.production` to point to your hosted backend API.

## GitHub Pages Notes

This app is configured to work as a GitHub Pages frontend, but the backend cannot run on GitHub Pages. The frontend is static-hosted, while the API should be deployed elsewhere.

For GitHub Pages deployment, the app uses a HashRouter-friendly setup and a Vite base path configuration.

## Deployment

### Frontend

The repo includes a GitHub Actions workflow under `.github/workflows/deploy.yml` for GitHub Pages deployment.

### Backend

Deploy the Express API on a platform such as:

- Render
- Railway
- Fly.io
- DigitalOcean App Platform
- any Node.js-compatible hosting service

Then update the frontend production environment variables to use the deployed API URL.

## Scripts

### Backend

```bash
cd backend
npm start
npm run start-dev
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

## License

This project is provided for learning and personal use.
