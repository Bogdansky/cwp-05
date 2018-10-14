const fs = require('fs');
const valid = require("./valid")

module.exports.readall = function create(req, res, payload, cb){
    if(valid.isValid(req.url, payload))
    {
      let articles = JSON.parse(fs.readFileSync('articles.json'));
      payload.id = Math.ceil(Math.random()*5);
      articles.push(payload);
      fs.writeFile('articles.json', JSON.stringify(articles), "utf-8", () => {
        fs.appendFile('log.txt',`\nNew article:${payload}\n`, () => {});
        cb(null, {"status":"success"});
      });
    }
    else{
      cb(nonObj);
    }
}