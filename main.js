document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const submitBtn = document.getElementById('submit-btn');
  const authForm = document.getElementById('auth-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  let isLogin = true;

  tabLogin.addEventListener('click', () => {
    isLogin = true;
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    submitBtn.textContent = 'Enter Portal';
  });

  tabRegister.addEventListener('click', () => {
    isLogin = false;
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    submitBtn.textContent = 'Create Account';
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) return;

    // Mock authentication
    localStorage.setItem('currentUser', username);
    window.location.href = '/feed.html';
  });

  // Check if already logged in
  if (localStorage.getItem('currentUser')) {
    window.location.href = '/feed.html';
  }
});
