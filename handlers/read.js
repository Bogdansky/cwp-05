const fs = require('fs');
const valid = require("./valid")

module.exports.read = function read(req, res, payload, cb){
    if(valid.isValid(req.url, payload)){
      let articles = JSON.parse(fs.readFileSync('articles.json'));
      let result;
      articles.forEach(article => {
        if(article.id === payload.id){
          result = article;
        }
      });
      fs.appendFile('log.txt',`\n${result}\n`, () => {})
      cb(null,result ? result: {code:418,message:"I'm teapot"});
    }
    else{
      cb(nonObj);
    }
}