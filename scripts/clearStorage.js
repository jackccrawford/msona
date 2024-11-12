// Clear all storage
window.localStorage.clear();
window.sessionStorage.clear();

// Clear all cookies
document.cookie.split(';').forEach(cookie => {
  document.cookie = cookie
    .replace(/^ +/, '')
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
});

console.log('Storage cleared successfully!');