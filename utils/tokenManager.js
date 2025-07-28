const request = require('supertest');
const api = request('https://serverest.dev');
const { faker } = require('@faker-js/faker');
const email = faker.internet.email()
const password = "teste";
const name = faker.person.firstName()



class TokenManager {
  
  constructor() {
    this.token = null;
    this.userId = null;
  }


    async createUser() {
    if (this.token) {
      return this.token;
    }

    try {
      

      const res = await api.post('/usuarios').send({
        nome: name,
        email: email,
        password: password,
        administrador: "true"
      })

      

      if (res.status === 201) {
        console.log(` ${res.body.message} com email: ${email} `)
      } else {
        throw new Error(`Falha na criação: ${res.body.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro:', error.message);
      throw error;
    }
  }

  async getToken() {
    if (this.token) {
      return this.token;
    }

    await this.createUser()

    try {

      const res = await api.post('/login').send({
        email: email,
        password: password,
      });
      
      if (res.status === 200 && res.body.authorization) {
        this.token = res.body.authorization;
        console.log("Login com email: "+ email)
        return this.token;
      } else {
        throw new Error(`Falha no login com email: ${email} ${res.body.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao obter token:', error.message);
      throw error;
    }
  }

  async getUserId() {
    if (this.userId) {
      return this.userId;
    }

    try {
      const token = await this.getToken();
      
      const res = await api
        .get('/usuarios')
        .set('Authorization', token)
        .query({ email: email });

      if (res.status === 200 && res.body.usuarios && res.body.usuarios.length > 0) {
        this.userId = res.body.usuarios[0]._id;
        this.userEmail = res.body.usuarios[0].email;
        return this.userId;
      } else {
        throw new Error('Usuário de email ' +email+ ' não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter ID do usuário ' +email+ ':', error.message);
      throw error;
    }
  }
  async getUserInfo() {
    const token = await this.getToken();
    const userId = await this.getUserId();
    
    return {
      token,
      userId,
    };
  }

  reset() {
    this.token = null;
    this.userId = null;
    console.log('TokenManager resetado');
  }

  async validateToken() {
    if (!this.token) {
      return false;
    }

    try {
      const res = await api
        .get('/usuarios')
        .set('Authorization', this.token);
      
      return res.status === 200;
    } catch (error) {
      return false;
    }
  }
}

const tokenManager = new TokenManager();

module.exports = {
  getToken: () => tokenManager.getToken(),
  getUserId: () => tokenManager.getUserId(),
  getUserInfo: () => tokenManager.getUserInfo(),
  reset: () => tokenManager.reset(),
  validateToken: () => tokenManager.validateToken()
};