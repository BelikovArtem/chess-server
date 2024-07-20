const userService = require('./user.service');

class UserController {
  async getMany(req, res) {
    const users = await userService.getMany();
    res.json(users);
  }

  async getOne(req, res) {
    const id = req.params.id;

    const user = await userService.getOne(id);
    res.json(user);
  }

  async delete(req, res) {
    const id = req.params.id;

    const user = await userService.delete(id);
    res.json(user);
  }

  async create(req, res) {
    const { name, password } = req.body;

    try {
      const user = await userService.create(name, password);
      res.json(user);
    } catch (e) {
      console.log(e);
      res.status(500).send('Name taken');
    }
  }

  async update(req, res) {
    const { id, field, value } = req.body;

    try {
      const userId = await userService.update(field, value, id);
      res.json(userId);
    } catch {
      console.log(e);
      res.status(500).send('Incorrect field to update');
    }
  }
}

module.exports = new UserController();