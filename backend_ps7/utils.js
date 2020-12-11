const jwt = require('jsonwebtoken');

module.exports = {
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            let jwtToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            if(jwtToken != null)
              userId = jwtToken.userId;
          } catch(err) { 
              console.log('erreur', err);
          }
        }
        return userId;
    }
}