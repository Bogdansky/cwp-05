const fs = require('fs');
const valid = require("./valid")

module.exports.deleteComment = function deleteComment(req, res, payload, cb){
    if(valid.isValid(req.url, payload)){
      const json = fs.readFileSync('articles.json');
      let articles = JSON.parse(json);
      fs.appendFile('log.txt',`\n${payload}\n`, () => {});
      payload.id = Math.ceil(Math.random()*10);
      let result;
      articles.forEach(article => {
        article.comments.forEach(comment => {
          if (comment.id === payload.id){
            let index = article.comments.indexOf(article)
            result = comment;
            article.comments.splice(index, 1);
          }
        });
      });
      fs.writeFile('articles.json', JSON.stringify(articles), (err) => {
        fs.appendFile('log.txt', `\n${result}\n`, () => {});
        cb(null,result ? result : nonObj);
      });
    }
    else{
      cb(nonObj);
    }
}