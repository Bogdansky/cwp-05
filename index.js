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

// function readall(req, res, payload, cb){
//   let articles = JSON.parse(fs.readFileSync('articles.json'));
//   cb(null, articles);
// }

// function read(req, res, payload, cb){
//   if(isValid(req.url, payload)){
//     let articles = JSON.parse(fs.readFileSync('articles.json'));
//     let result;
//     articles.forEach(article => {
//       if(article.id === payload.id){
//         result = article;
//       }
//     });
//     logger.write(`\n${result}\n`)
//     cb(null,result ? result: {code:418,message:"I'm teapot"});
//   }
//   else{
//     cb(nonObj);
//   }
// }

// function create(req, res, payload, cb){
//   if(isValid(req.url, payload))
//   {
//     let articles = JSON.parse(fs.readFileSync('articles.json'));
//     payload.id = Math.ceil(Math.random()*5);
//     articles.push(payload);
//     fs.writeFile('articles.json', JSON.stringify(articles), "utf-8", () => {
//       log(`\nNew article:${payload}\n`);
//       cb(null, {"status":"success"});
//     });
//   }
//   else{
//     cb(nonObj);
//   }
// }

// function update(req, res, payload, cb){}
// function del(req, res, payload, cb){
//   if (isValid(req.url, payload)){
//     let json = fs.readFileSync('articles.json');
//     let articles = JSON.parse(json);
//     articles.forEach(element => {
//         if (element.id === payload.id){
//             articles.splice(articles.indexOf(element), 1);
//         }
//     });
//     fs.writeFile('articles.json', JSON.stringify(articles), () => {
//       logger.write('\nsuccess');
//       cb({"status":"success"});
//     });
//   }
//   else{
//     cb(nonObj);
//   }
// }
// function createComment(req, res, payload, cb){
//   if(isValid(req.url, payload)){
//     const json = fs.readFileSync('articles.json');
//     let articles = JSON.parse(json);
//     logger.write(`\n${payload}\n`)
//     payload.id = Math.ceil(Math.random()*10);
//     let result;
//     articles.forEach(article => {
//       if (article.id === payload.articleId){
//         article.comments.push(payload);
//         result = article;
//       }
//     });
//     fs.writeFile('articles.json', JSON.stringify(articles), (err) => {
//       cb(null,result ? result : nonObj);
//     });
//   }
//   else{
//     cb(nonObj);
//   }
// }
// function deleteComment(req, res, payload, cb){
//   if(isValid(req.url, payload)){
//     const json = fs.readFileSync('articles.json');
//     let articles = JSON.parse(json);
//     logger.write(`\n${payload}\n`)
//     payload.id = Math.ceil(Math.random()*10);
//     let result;
//     articles.forEach(article => {
//       article.comments.forEach(comment => {
//         if (comment.id === payload.id){
//           let index = article.comments.indexOf(article)
//           result = comment;
//           article.comments.splice(index, 1);
//         }
//       });
//     });
//     fs.writeFile('articles.json', JSON.stringify(articles), (err) => {
//       logger.write(`\n${result}\n`);
//       cb(null,result ? result : nonObj);
//     });
//   }
//   else{
//     cb(nonObj);
//   }
// }

function log(info){
  let date = new Date(); 
  const dateString =  `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  logger.write(`${dateString} ${timeString} `+info);
}

// function isValid(url,payload){
//   const method = getLastFromPos(url, 1);
//   if (method === 'create'){
//     if (getLastFromPos(url, 2) === 'articles'){
//       return checkCreateArticle(payload);
//     }
//     if (getLastFromPos(url, 2) === 'comments'){
//       return checkCreateComment(payload);
//     }
//   }
//   else if (method === 'delete' || method === 'read'){
//     if (payload.length !== 1){
//       return false;
//     }
//     if (!payload.id){
//       return false;
//     }
//     if (typeof payload !== 'number' || typeof payload !== 'string'){
//       return false;
//     }
//   }
//   return true;
// }

// function getLastFromPos(url, pos){
//   let partsOfUrl = url.split('/');
//   return partsOfUrl[partsOfUrl.length-pos];
// }

// function checkCreateArticle(payload){
//   if (payload.length != 5){
//     return false;
//   }
//   if (typeof payload.title !== 'string'){
//     return false;
//   }
//   if (typeof payload.text !== 'string'){
//     return false;
//   }
//   if (typeof payload.date !== 'number'){
//     return false;
//   } 
//   if (typeof payload.author !== 'string'){
//     return false;
//   }
//   if (typeof payload.comments !== 'object'){
//     return false;
//   }
//   else{
//     if (payload.comments === '[]'){
//       return true;
//     }
//     else{
//       return checkCreateComment(payload.comments);
//     }
//   }
// }

// function checkCreateComment(payload){
//   if (payload==='undefined'){
//     return false;
//   }
//   if (typeof payload.articleId !== 'number' || typeof payload.articleId !== 'string'){
//     return false;
//   }
//   if (typeof payload.text !== 'string'){
//     return false;
//   }
//   if (typeof payload.date !== 'number'){
//     return false;
//   }
//   if (typeof payload.author !== 'string'){
//     return false;
//   }
//   return true;
// }