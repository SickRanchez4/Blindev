const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

Object.assign(process.env, {
  NODE_ENV: 'test',
  MAIL_USER: '',
  MAIL_PASS: '',
  CONTACT_RATE_LIMIT_MAX: '1000',
  CHATBOT_ENDPOINT: 'https://chat.example.com/</script>',
});

const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const postContact = (body) =>
  fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

test('GET /health responds ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('GET / injects the chatbot endpoint safely', async () => {
  for (const path of ['/', '/index.html']) {
    const html = await (await fetch(`${baseUrl}${path}`)).text();
    assert.match(html, /window\.CHATBOT_ENDPOINT="https:\/\/chat\.example\.com\/\\u003c\/script>";<\/script>\n<\/head>/);
  }
});

test('serves static assets', async () => {
  const res = await fetch(`${baseUrl}/contactForm.js`);
  assert.equal(res.status, 200);
});

test('unknown routes return a JSON 404', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  const body = await res.json();
  assert.equal(res.status, 404);
  assert.equal(body.status, 'error');
  assert.equal(body.message, 'Cannot find /does-not-exist on this server!');
});

test('POST /contact rejects invalid payloads with 400', async () => {
  const res = await postContact({ name: 'Ana', email: 'bad', subject: 'Hola', message: '0123456789' });
  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.message, 'Please provide a valid email address');
});

test('POST /contact handles malformed JSON with a consistent error body', async () => {
  const res = await postContact('{bad');
  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.status, 'error');
  assert.equal(body.statusCode, 400);
});

test('POST /contact reports missing mail configuration', async () => {
  const res = await postContact({ name: 'Ana', email: 'ana@example.com', subject: 'Hola', message: '0123456789' });
  const body = await res.json();
  assert.equal(res.status, 500);
  assert.match(body.message, /Email configuration is missing/);
});
