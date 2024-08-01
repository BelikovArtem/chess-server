import jwt from '../auth/jwt';
import headers from '../consts';

export default function verify(req, res, next) {
  const reqHeaders = req.headers;
  if (reqHeaders.authorization) {
    const token = jwt.getFromHeaders(reqHeaders);
    
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