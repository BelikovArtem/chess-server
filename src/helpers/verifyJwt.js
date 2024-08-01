const jwt = require('../auth/jwt');
const headers = require('../consts');

module.exports = function verify(req, res, next) {
  const headers = req.headers;
  if (headers.authorization) {
    const token = jwt.getFromHeaders(headers);
    
    jwt.verify(token)
    .then(name => {
      req.name = name;
      next();
    })
    .catch(err => {
      console.log(err);
      res.writeHead(403, {
        ...headers
      }).end();
    });
  } else {
    res.writeHead(401, {
      ...headers
    }).end();
  }
}