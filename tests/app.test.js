const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('deve retornar a página HTML de boas-vindas', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Bem-vindo ao projeto Node.js do Cesusc DevOps!');
  });
});