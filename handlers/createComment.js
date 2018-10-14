const fs = require('fs');
const valid = require("./valid")

module.exports.createComment = function createComment(req, res, payload, cb){
    if(valid.isValid(req.url, payload)){
      const json = fs.readFileSync('articles.json');
      let articles = JSON.parse(json);
      fs.appendFile('log.txt', `\n${payload}\n`, () => {})
      payload.id = Math.ceil(Math.random()*10);
      let result;
      articles.forEach(article => {
        if (article.id === payload.articleId){
          article.comments.push(payload);
          result = article;
        }
      });
      fs.writeFile('articles.json', JSON.stringify(articles), (err) => {
        cb(null,result ? result : nonObj);
      });
    }
    else{
      cb(nonObj);
    }
}