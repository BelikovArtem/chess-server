const jwt = require('./jwt');
const headers = require('../consts');
const authService = require('./auth.service');

class AuthController {
  // post
  async signUp(req, res) {
    const { name, password } = req.body;
    
    try {
      const userId = await authService.signUp(name, password);
  
      if (!userId) {
        return res.writeHead(422, {
          ...headers
        }).end(JSON.stringify({ err: 'Username taken' }));
      }
  
      const { accessToken, refreshToken } = await jwt.generatePair(
        name, '1min', '1d' 
      );
  
      // Store refreshToken in the database
      const isSuccess = await authService.storeToken(userId, refreshToken);
      if (!isSuccess) {
        throw new Error('Refresh token cannot be stored');
      }

      res.cookie('token', refreshToken, {
        httpOnly: true,
        maxAge: 86400000 // 1d in milliseconds
      });
  
      res.writeHead(200, {
        ...headers
      }).end(JSON.stringify({accessToken}));
    } catch (err) {
      res.writeHead(599, {
        ...headers
      }).end(JSON.stringify({err: 'Tokens cannot be signed'}));
    }
  }

  // post
  async signIn(req, res) {
    const { name, password } = req.body;

    try {
      const user = await authService.signIn(name, password);

      if (!user) {
        throw new Error('Incorrect username or password');
      }

      const { accessToken, refreshToken } = await jwt.generatePair(
        name, '1min', '1d' 
      );
      
      // Store refreshToken in the database
      const isSuccess = await authService.storeToken(user.id, refreshToken);
      if (!isSuccess) {
        throw new Error('Refresh token cannot be stored');
      }

      res.cookie('token', refreshToken, {
        httpOnly: true,
        maxAge: 86400000 // 1d in milliseconds
      });
  
      res.writeHead(200, {
        ...headers
      }).end(JSON.stringify({accessToken}));
    } catch (err) {
      console.log(err);
      res.writeHead(422, {
        ...headers
      }).end();
    }
  }

  // get
  async signOut(req, res) {
    const token = jwt.getFromHeaders(req.headers);

    if (!token) {
      res.writeHead(401, {
        ...headers
      }).end();
      return;
    }
    
    const isSuccess = await authService.signOut(token); 
    if (isSuccess) {
      res.clearCookie('token');
      res.writeHead(200, {
        ...headers
      }).end();
    } else {
      res.writeHead(403, {
        ...headers
      }).end();
    }
  }

  // options
  async cors(req, res) {
    res.writeHead(200, {
      ...headers
    }).end();
  }

  // get
  async refreshToken(req, res) {
    const token = jwt.getFromHeaders(req.headers);

    if (!token) {
      res.writeHead(401, {
        ...headers
      }).end();
      return;
    }

    const name = await jwt.verify(token);
    const tokenData = await authService.findToken(token);

    if (!name || !tokenData) {
      res.writeHead(403, {
        ...headers
      }).end();
      return;
    } else {
      /*
       * TODO: implement injection of the user contoller to 
       * keep track of the user`s data changes
       */
      const { accessToken, refreshToken } = await jwt.generatePair(
        name, '1min', '1d' 
      );
      
      // Store refreshToken in the database
      const isSuccess = await authService.storeToken(user.id, refreshToken);
      if (!isSuccess) {
        throw new Error('Refresh token cannot be stored');
      }

      res.cookie('token', refreshToken, {
        httpOnly: true,
        maxAge: 86400000 // 1d in milliseconds
      });
  
      res.writeHead(200, {
        ...headers
      }).end(JSON.stringify({accessToken}));
    }
  }
} 


module.exports = new AuthController();