const request = require('supertest');
const { getToken, getUserId, getUserInfo } = require('../utils/tokenManager');
const api = request('https://serverest.dev');

describe('GET /usuarios', () => {
  it('Deve buscar os usuários com sucesso', async () => {
    const { token, userId } = await getUserInfo();

    const res = await api
      .get('/usuarios')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('usuarios');
    expect(Array.isArray(res.body.usuarios)).toBe(true);
    expect(res.body.usuarios.length).toBeGreaterThan(0);

    const ourUser = res.body.usuarios.find(user => user._id === userId);
    expect(ourUser).toBeDefined();
  });

  
});