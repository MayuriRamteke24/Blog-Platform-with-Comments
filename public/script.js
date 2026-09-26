const state = {
  token: localStorage.getItem('blogToken') || '',
  user: JSON.parse(localStorage.getItem('blogUser') || 'null'),
  editingPostId: null,
  posts: [],
};

const elements = {
  registerForm: document.getElementById('registerForm'),
  loginForm: document.getElementById('loginForm'),
  postForm: document.getElementById('postForm'),
  logoutBtn: document.getElementById('logoutBtn'),
  welcome: document.getElementById('welcome'),
  posts: document.getElementById('posts'),
  postFormTitle: document.getElementById('postFormTitle'),
  postTitle: document.getElementById('postTitle'),
  postContent: document.getElementById('postContent'),
  cancelEditBtn: document.getElementById('cancelEditBtn'),
};

const api = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

const getUserGreeting = () => (state.user ? `Hi, ${state.user.username}` : '');

const setAuthState = () => {
  const isLoggedIn = Boolean(state.user);
  elements.welcome.textContent = getUserGreeting();
  elements.welcome.classList.toggle('hidden', !isLoggedIn);
  elements.logoutBtn.classList.toggle('hidden', !isLoggedIn);
  elements.postForm.classList.toggle('hidden', !isLoggedIn);
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatContent = (content) => escapeHtml(content).replace(/\n/g, '<br>');

const findPostById = (id) => state.posts.find((post) => post.id === id);

const renderPosts = (posts) => {
  state.posts = posts;

  if (!posts.length) {
    elements.posts.innerHTML = '<p class="empty-state">No posts yet. Be the first to share a story.</p>';
    return;
  }

  elements.posts.innerHTML = posts
    .map(
      (post) => `
        <article class="post" data-id="${post.id}">
          <div class="post-header">
            <div>
              <h3>${escapeHtml(post.title)}</h3>
              <div class="post-meta">By ${escapeHtml(post.username)} • ${new Date(post.createdAt).toLocaleString()}</div>
            </div>
            ${state.user && state.user.id === post.userId ? `
              <div class="post-actions">
                <button class="button secondary edit-post" data-id="${post.id}">Edit</button>
                <button class="button danger delete-post" data-id="${post.id}">Delete</button>
              </div>` : ''}
          </div>
          <p>${formatContent(post.content)}</p>

          <div class="comment-list">
            ${post.comments.map(
              (comment) => `
                <div class="comment">
                  <div class="comment-header">
                    <strong>${escapeHtml(comment.author)}</strong>
                    <small>${new Date(comment.createdAt).toLocaleString()}</small>
                  </div>
                  <p>${escapeHtml(comment.content)}</p>
                </div>
              `
            ).join('') || '<p class="empty-state">No comments yet.</p>'}

            ${state.user ? `
              <form class="comment-form" data-post-id="${post.id}">
                <input type="text" name="comment" placeholder="Add a comment" required />
                <button type="submit" class="button primary">Comment</button>
              </form>
            ` : ''}
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.delete-post').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.id);
      if (confirm('Delete this post?')) {
        await api(`/api/posts/${id}`, { method: 'DELETE' });
        loadPosts();
      }
    });
  });

  document.querySelectorAll('.edit-post').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const post = findPostById(id);
      if (!post) return;
      state.editingPostId = id;
      elements.postTitle.value = post.title;
      elements.postContent.value = post.content;
      elements.postFormTitle.textContent = 'Edit post';
      elements.cancelEditBtn.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.comment-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="comment"]');
      const postId = form.dataset.postId;
      await api(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: input.value.trim() }),
      });
      input.value = '';
      loadPosts();
    });
  });
};

const loadPosts = async () => {
  try {
    const data = await api('/api/posts');
    renderPosts(data.posts);
  } catch (error) {
    console.error(error);
  }
};

elements.registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;

  try {
    const data = await api('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('blogToken', state.token);
    localStorage.setItem('blogUser', JSON.stringify(state.user));
    setAuthState();
    elements.registerForm.reset();
    loadPosts();
  } catch (error) {
    alert(error.message);
  }
});

elements.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('blogToken', state.token);
    localStorage.setItem('blogUser', JSON.stringify(state.user));
    setAuthState();
    elements.loginForm.reset();
    loadPosts();
  } catch (error) {
    alert(error.message);
  }
});

elements.postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.user) {
    alert('Please log in to publish a post.');
    return;
  }

  const payload = {
    title: elements.postTitle.value.trim(),
    content: elements.postContent.value.trim(),
  };

  try {
    if (state.editingPostId) {
      await api(`/api/posts/${state.editingPostId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      await api('/api/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    elements.postForm.reset();
    elements.postFormTitle.textContent = 'Write a post';
    elements.cancelEditBtn.classList.add('hidden');
    state.editingPostId = null;
    loadPosts();
  } catch (error) {
    alert(error.message);
  }
});

elements.cancelEditBtn.addEventListener('click', () => {
  state.editingPostId = null;
  elements.postForm.reset();
  elements.postFormTitle.textContent = 'Write a post';
  elements.cancelEditBtn.classList.add('hidden');
});

elements.logoutBtn.addEventListener('click', () => {
  state.token = '';
  state.user = null;
  state.editingPostId = null;
  localStorage.removeItem('blogToken');
  localStorage.removeItem('blogUser');
  elements.postForm.reset();
  elements.postFormTitle.textContent = 'Write a post';
  elements.cancelEditBtn.classList.add('hidden');
  setAuthState();
  loadPosts();
});

const initialLoad = async () => {
  setAuthState();
  await loadPosts();
};

initialLoad();
