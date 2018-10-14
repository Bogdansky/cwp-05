const http = require('http');
const fs = require('fs');
const logger = fs.createWriteStream('log.txt');
const nonObj = { code: 404, message: 'Not found'};
const hostname = '127.0.0.1';
const port = 3000;

const readAll = require('./handlers/readAll');
const read = require('./handlers/read');
const create = require('./handlers/create');
const update = require('./handlers/update');
const del = require('./handlers/delete');
const createComment = require('./handlers/createComment');
const deleteComment = require('./handlers/deleteComment');

const handlers = {
  '/sum': sum,
  '/mult': mult,
  '/api/articles/readall' : readAll.readall,
  '/api/articles/read' : read.read,
  '/api/articles/create' : create.create,
  '/api/articles/update' : update.update,
  '/api/articles/delete' : del.del,
  '/api/comments/create' : createComment.createComment,
  '/api/comments/delete' : deleteComment.deleteComment
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {

    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result) => {
      if (err) {
        log(`\nurl: ${req.url}`);
        log(`\nRequest:${payload}`);
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  return handlers[url] || notFound;
}


function notFound(req, res, payload, cb) {
  cb(nonObj);
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}

function sum(req, res, payload, cb) {
  const result = { c: payload.a + payload.b };
  cb(null, result);
}

function mult(req, res, payload, cb) {  
  const result = { c: payload.a * payload.b };

  cb(null, result);
}

function log(info){
  let date = new Date(); 
  const dateString =  `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  logger.write(`${dateString} ${timeString} `+info);
}