const userFetcher = require('./user.fetcher');

class UserService {
  async getMany() {
    return await userFetcher.getMany();
  }

  async getOne(id) {
    return await userFetcher.getOne(id);
  }

  async delete(id) {
    return await userFetcher.delete(id);
  }

  async create(name, password) {
    return await userFetcher.create(name, password);   
  }

  async update(field, value, id) {
    return await userFetcher.update(field, id, value);
  }
}

module.exports = new UserService();