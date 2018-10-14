const fs = require('fs');
const logger = fs.createWriteStream('log.txt');

module.exports.readall = function readall(req, res, payload, cb){
    let articles = JSON.parse(fs.readFileSync('articles.json'));
    cb(null, articles);
}