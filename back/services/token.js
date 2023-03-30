const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret = require('../config/secret');
const bcrypt = require('bcrypt');
const redis = require('redis');
const redisClient = redis.createClient();
const crypto_key = '1a7c114351a4c2a2a9ef9e1187ac70f='
const crypto_iv = '55abc13120890eb='
const algorithm = 'aes-512-cbc';

function _encrypt(token) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(crypto_key), crypto_iv);
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return encrypted.toString('hex');
}

function _decrypt(token) {

  try {

    if(!token) return false;

    let encryptedText = Buffer.from(token, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(crypto_key), iv = Buffer.from(crypto_iv));
    let decrypted = decipher.update(Buffer.from(token, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();

  } catch (e) {

    return false;

  }

}

function disableToken(token) {
  const key = `tokenkey:${token}`;
  return redisClient.set(key,1, redis.print);
}

isDisabledToken = async (token)=> {
  const key = `tokenkey:${token}`;
  return new Promise( resolve => {
    redisClient.get(key, (err, res) => {
      if(err) return resolve(false);
      return resolve(res === '1');
    });
  });

}

// create a new token
function createToken(user) {
  
  // let scopes;
  // scopes = user.scope;
  
  // Sign the JWT
  const token = jwt.sign(
    {
      id: user.id, 
      username: user.username,
      email: user.email,
      password:user.password,
      deviceId: user.deviceId,
      // spaceId: user.space_id,
      // scope: [scopes]
    }, 
    secret, 
    { 
      algorithm: 'HS256', 
      expiresIn: '183d'//Half year.
    }
  );

  return _encrypt(token);

}

// create a shortlife token
function createShortToken(user) {
  

  // Sign the JWT
  const token = jwt.sign({ 
    id: user.id, 
    password:user.password,
    email: user.email,
  }, 
    secret, 
    { algorithm: 'HS256', expiresIn: '2h' } );

  return _encrypt(token);

}

function makeToken(data) {
  
  const token = jwt.sign(
    data, 
    secret, 
    { algorithm: 'HS256', expiresIn: '7200 days' } //20 years token.
  );

  return _encrypt(token);
}

function decodeToken(token) {
  token = _decrypt(token);
  return jwt.decode(token, secret);

}

function verifyToken(token){
  try {
    token = _decrypt(token);
    if(!token) return false;
    return jwt.verify(token, secret)
  } catch(e) {
    return {
      error: e
    };
  }
}

// hash password
function hashPassword(password, cb) {

  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });

}

function _hashPassword(password) {

}

_hashPassword = async (password)=> {
  return new Promise( (resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if(err) return reject(err);
        return resolve(hash);
      });
    });

  });

}


module.exports = {
  createToken: createToken,
  createShortToken: createShortToken,
	makeToken: makeToken,
  decodeToken: decodeToken,
  verifyToken: verifyToken,
	hashPassword: hashPassword,
  _hashPassword: _hashPassword,
  disableToken: disableToken,
  isDisabledToken: isDisabledToken,
  _encrypt: _encrypt,
  _decrypt: _decrypt,
};