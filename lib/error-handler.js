'use strict';

module.exports = function (err, res){
  console.log('error message', err);
  let msg = err.message.toLowerCase();
  if (err.code === 'MessageRejected') return res.status(400).send(`${err.name}: ${err.message}`);

  switch(true){
  case msg.includes('validation'): return res.status(400).send(`${err.name}: ${err.message}`);
  case msg.includes('restaurant') : return res.status(400).send(`${err.name}: ${err.message}`);
  case msg.includes('authorization'): return res.status(401).send(`${err.name}: ${err.message}`);
  case msg.includes('path error'): return res.status(404).send(`${err.name}: ${err.message}`);
  case msg.includes('objectid failed'): return res.status(404).send(`${err.name}: ${err.message}`);
  case msg.includes('no file'): return res.status(404).send(`${err.name}: ${err.message}`);
  case msg.includes('duplicate key'): return res.status(409).send(`${err.name}: ${err.message}`);
  case msg.includes('CastError'): return res.status(404).send(`${err.name}: ${err.message}`);
  default: return res.status(500).send(`${err.name}: ${err.message}`);
  }
};