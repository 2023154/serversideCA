document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      // Redirect to form.html on successful login
      window.location.href = 'admindashboard.html';
    } else {
      // Show an alert or error message for incorrect credentials
      alert('Invalid username or password!');
    }
  });


  