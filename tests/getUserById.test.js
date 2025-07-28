const request = require('supertest');
const api = request('https://serverest.dev');
const { getToken, getUserId, getUserInfo } = require('../utils/tokenManager');

describe('GET /usuarios/{id}', () => {
  it('Deve buscar os usuário especifico por id', async () => {
    const { token, userId } = await getUserInfo();

    const res = await api
      .get(`/usuarios/${userId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId)
  });
});