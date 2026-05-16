document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('current-user-display').textContent = `@${currentUser}`;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
  });

  const postBtn = document.getElementById('post-btn');
  const postText = document.getElementById('post-text');
  const fileUpload = document.getElementById('file-upload');
  const postsContainer = document.getElementById('posts-container');
  const mediaPreviewContainer = document.getElementById('media-preview-container');

  let currentMedia = null;
  let currentMediaType = null;

  // Mock initial data
  let posts = [
    {
      id: 1,
      author: 'admin',
      text: 'Welcome to the Fatima Youth Federation platform! Feel free to share your thoughts and media.',
      media: null,
      mediaType: null,
      likes: 5,
      hasLiked: false,
      comments: [
        { author: 'john_doe', text: 'This looks amazing!' }
      ],
      timestamp: new Date().toISOString()
    }
  ];

  function renderPosts() {
    postsContainer.innerHTML = '';
    
    // Sort posts newest first
    const sortedPosts = [...posts].reverse();

    sortedPosts.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'post-card';
      
      let mediaHtml = '';
      if (post.media) {
        if (post.mediaType && post.mediaType.startsWith('video/')) {
          mediaHtml = `<video class="post-media" src="${post.media}" controls></video>`;
        } else {
          mediaHtml = `<img class="post-media" src="${post.media}" alt="Post media" />`;
        }
      }

      let commentsHtml = post.comments.map(c => 
        `<div class="comment"><strong>@${c.author}</strong> ${c.text}</div>`
      ).join('');

      postEl.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">${post.author.charAt(0).toUpperCase()}</div>
          <div class="post-author-info">
            <div style="font-weight: 600;">@${post.author}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted)">Just now</div>
          </div>
        </div>
        ${mediaHtml}
        <div class="post-content">
          <p>${post.text}</p>
        </div>
        <div class="post-actions">
          <button class="action-btn ${post.hasLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${post.hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            ${post.likes}
          </button>
          <button class="action-btn" onclick="focusComment(${post.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Comment
          </button>
        </div>
        <div class="comments-section">
          ${commentsHtml}
          <form class="add-comment" onsubmit="addComment(event, ${post.id})">
            <input type="text" placeholder="Add a comment..." required id="comment-input-${post.id}" />
            <button type="submit">Post</button>
          </form>
        </div>
      `;
      postsContainer.appendChild(postEl);
    });
  }

  // File Upload Preview
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      currentMediaType = file.type;
      const reader = new FileReader();
      reader.onload = (e) => {
        currentMedia = e.target.result;
        mediaPreviewContainer.style.display = 'block';
        if (currentMediaType.startsWith('video/')) {
          mediaPreviewContainer.innerHTML = `<video src="${currentMedia}" controls></video>`;
        } else {
          mediaPreviewContainer.innerHTML = `<img src="${currentMedia}" />`;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Create Post
  postBtn.addEventListener('click', () => {
    const text = postText.value.trim();
    if (!text && !currentMedia) return;

    const newPost = {
      id: Date.now(),
      author: currentUser,
      text: text,
      media: currentMedia,
      mediaType: currentMediaType,
      likes: 0,
      hasLiked: false,
      comments: [],
      timestamp: new Date().toISOString()
    };

    posts.push(newPost);
    
    // Reset form
    postText.value = '';
    fileUpload.value = '';
    currentMedia = null;
    currentMediaType = null;
    mediaPreviewContainer.style.display = 'none';
    mediaPreviewContainer.innerHTML = '';

    renderPosts();
  });

  // Global functions for inline event handlers
  window.toggleLike = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (post.hasLiked) {
        post.likes--;
        post.hasLiked = false;
      } else {
        post.likes++;
        post.hasLiked = true;
      }
      renderPosts();
    }
  };

  window.addComment = (e, postId) => {
    e.preventDefault();
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    
    if (text) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.comments.push({
          author: currentUser,
          text: text
        });
        renderPosts();
      }
    }
  };

  window.focusComment = (postId) => {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input) input.focus();
  };

  renderPosts();
});
