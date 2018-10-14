const fs = require('fs');
const logger = fs.createWriteStream('log.txt');

module.exports.isValid = function isValid(url,payload){
    const method = getLastFromPos(url, 1);
    if (method === 'create'){
      if (getLastFromPos(url, 2) === 'articles'){
        return checkCreateArticle(payload);
      }
      if (getLastFromPos(url, 2) === 'comments'){
        return checkCreateComment(payload);
      }
    }
    else if (method === 'delete' || method === 'read'){
      if (payload.length !== 1){
        return false;
      }
      if (!payload.id){
        return false;
      }
      if (typeof payload !== 'number' || typeof payload !== 'string'){
        return false;
      }
    }
    return true;
}
  
function getLastFromPos(url, pos){
    let partsOfUrl = url.split('/');
    return partsOfUrl[partsOfUrl.length-pos];
}

function checkCreateArticle(payload){
    if (payload.length != 5){
        return false;
    }
    if (typeof payload.title !== 'string'){
        return false;
    }
    if (typeof payload.text !== 'string'){
        return false;
    }
    if (typeof payload.date !== 'number'){
        return false;
    } 
    if (typeof payload.author !== 'string'){
        return false;
    }
    if (typeof payload.comments !== 'object'){
        return false;
    }
    else{
        if (payload.comments === '[]'){
        return true;
        }
        else{
        return checkCreateComment(payload.comments);
        }
    }
}

function checkCreateComment(payload){
    if (payload==='undefined'){
        return false;
    }
    if (typeof payload.articleId !== 'number' || typeof payload.articleId !== 'string'){
        return false;
    }
    if (typeof payload.text !== 'string'){
        return false;
    }
    if (typeof payload.date !== 'number'){
        return false;
    }
    if (typeof payload.author !== 'string'){
        return false;
    }
    return true;
}