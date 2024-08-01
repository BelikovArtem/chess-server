import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function sign(payload, secret, options) {
  return new Promise((res, rej) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        rej(err);
      }
      res(token);
    });
  });
}

async function verify(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        rej(err);
      }
      res(decoded);
    });
  });
}

function getFromHeaders(headers) {
  return headers['authorization']?.split(' ')[1];
}

async function generatePair(name, accessExpires, refreshExpires) {  
  try {
    const accessToken = await sign(
      { name: name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessExpires } 
    );

    const refreshToken = await sign(
      { name: name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshExpires } 
    );

    return {
      accessToken,
      refreshToken
    };
  } catch (err) {
    return null;
  }
}

export default {
  sign,
  verify,
  generatePair,
  getFromHeaders
};