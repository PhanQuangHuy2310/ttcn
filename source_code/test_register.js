const data = JSON.stringify({
  email: "test.student@example.com",
  password: "password123",
  fullName: "Test Student",
  role: "STUDENT"
});

fetch('http://localhost:8085/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(console.error);
