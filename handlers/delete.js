const fs = require('fs');
const valid = require("./valid")

module.exports.del = function del(req, res, payload, cb){
    if (valid.isValid(req.url, payload)){
      let json = fs.readFileSync('articles.json');
      let articles = JSON.parse(json);
      articles.forEach(element => {
          if (element.id === payload.id){
              articles.splice(articles.indexOf(element), 1);
          }
      });
      fs.writeFile('articles.json', JSON.stringify(articles), () => {
        fs.appendFile('log.txt', '\nsuccess', () => {});
        cb({"status":"success"});
      });
    }
    else{
      cb(nonObj);
    }
}