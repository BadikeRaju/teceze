const authHandler = require('./api/auth');

async function testAuth() {
  const mockRes = {
    statusCode: 0,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(data) { console.log('JSON Response:', this.statusCode, data); return this; },
    end(data) { console.log('End Response:', this.statusCode, data); return this; }
  };

  // Test Signup
  console.log("--- Testing Signup ---");
  await authHandler({
    method: 'POST',
    query: { action: 'signup' },
    body: { username: 'testuser', password: 'password123' }
  }, mockRes);

  // Test Login
  console.log("--- Testing Login ---");
  await authHandler({
    method: 'POST',
    query: { action: 'login' },
    body: { username: 'testuser', password: 'password123' }
  }, mockRes);
}

testAuth().catch(console.error);
