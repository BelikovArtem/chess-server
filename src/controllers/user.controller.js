const query = require('../db/db');

class UserController {
  async getAll(req, res) {
    let sql = `SELECT
                id, name, password,
                registered_at, rapid_rating,
                blitz_rating, bullet_rating,
                games_count
               FROM users JOIN users_info
               ON id = user_id`;
    const users = await query(sql);

    if (!users.rows.length) {
      res.json({"detail": "Database doesn`t contain a single user"});
      return;
    }
    res.json(users.rows);
  }

  async getOne(req, res) {
    const id = req.params.id;

    let sql = `SELECT
                id, name, password,
                registered_at, rapid_rating,
                blitz_rating, bullet_rating,
                games_count
               FROM users JOIN users_info
               ON id = user_id
               WHERE id = $1`;
    const user = await query(sql, [id]);

    if (!user.rows.length) {
      res.json({"detail": "User not found"});
      return;
    }
    res.json(user.rows[0]);
  }

  async delete(req, res) {
    const id = req.params.id;

    let sql = `DELETE FROM users_info WHERE user_id = $1
               RETURNING *`;
 
    let user = await query(sql, [id]); 

    if (!user.rows.length) {
      res.json({"detail": "User not found"});
    } else {
      sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
      user = await query(sql, [id]);
      res.json(user.rows[0]);
    }
  }

  async updateField(req, res) {  
    const { field, id, value } = req.body;
    
    let table;
    switch (field) {
      case 'name':
      case 'password':
        table = 'users';
        break;

      case 'blitz_rating': 
      case 'rapid_rating':
      case 'bullet_rating':
      case 'games_count':
        table = 'users_info';
        break;

      default:
        res.json({"detail": "Incorrect field to update"});
        return;        
    }

    const idCol = table === 'users' ? 'id' : 'user_id'; 
    const sql = `UPDATE ${table} SET ${field} = $1
                 WHERE ${idCol} = $2 RETURNING *`;
    
    try {
      const user = await query(sql, [value, id]);
      res.json(user.rows[0]);
    } catch (e) {
      res.json(e);
    }
  }

  async create(req, res) {
    const { name, password } = req.body;  

    try {
      // insert a new user to the users table
      let sql = `INSERT INTO users (name, password)
                 VALUES ($1, $2) RETURNING *`;  

      const user = await query(sql, [name, password]);

      // insert a new user_info record
      sql = `INSERT INTO users_info (user_id) VALUES ($1)`;
      await query(sql, [user.rows[0].id]);

      // return created user to the client
      res.json(user.rows[0]);
    } catch (e) {
      // password_length or username_exists errors
      res.json(e);
    }
  }
}

function copyFields(obj1, obj2, ) {

}

module.exports = new UserController();