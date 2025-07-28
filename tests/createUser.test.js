const request = require('supertest');
const {getUserInfo } = require('../utils/tokenManager');
const api = request('https://serverest.dev');

describe('POST /usuarios', () => {
  it('Deve criar um novo usuário com sucesso', async () => {
    const { token } = await getUserInfo();
   
    const testData = {
      nome: "Usuário Teste",
      email: `teste_${Date.now()}@mail.com`,
      password: "123456",
      administrador: "true"
    };

    const res = await api
      .post('/usuarios')
      .set('Authorization', token)
      .send(testData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Cadastro realizado com sucesso');
    expect(res.body).toHaveProperty('_id');
  });

});