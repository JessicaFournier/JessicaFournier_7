//Imports
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../connexionDatabase');
const queryDbb = require('../queryBdd');

//Constant
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

//Controlers

//sauvegarde un nouvel utilisateur, hash le mot de passe
exports.signup = (req, res, next) => {
    const name = req.body.name;
    const firstName = req.body.firstName;
    const email = req.body.email;
    let password = req.body.password;
    let photo = null

    if (req.file) {
        photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({'error': 'l\'email n\'est pas valide'})
    }

    if(!passwordRegex.test(password)) {
        return res.status(400).json({'error': 'mot de passe non valide : il doit contenir entre 4 et 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre'})
    }

    if (name == null || firstName == null || email == null || password == null) {
        return res.status(400).json({'error' : 'items manquants'});
    }

    const queryStringEmailUnique = queryDbb.userEmailUnique();
    const insertEMail = [email]
    connection.query(queryStringEmailUnique, insertEMail, (error, result, fields) => {
        if(result.length>0) {
            if (result[0].email == email) {
                return res.status(400).json({'error': 'l\'email est déjà utilisé !'})
            }
        } else {
            // hachage du mot de passe, salage par 10
            bcrypt.hash(password, 10)
            .then(hash => {
                password = hash;

                let queryString = queryDbb.userCreate();
                const insert = [name, firstName, email, password, photo]

                connection.query(queryString, insert, (error, result, fields) => {
                    if (error) {
                    return res.status(500).json({error: "mysql"});
                    } else {
                    return res.status(200).json(result);
                    }
                });
            
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};


//vérifie si l'utilisateur existe, si oui, on vérifie le mot de passe. Si celui ci est correct, on renvoie un tokenn contenant l'ID de l'utilisateur
//sinon on renvoie une erreur
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const insert = [email];

    let queryString = queryDbb.userLogin();

    connection.query(queryString, insert, (error, result, fields) => {
        if (error) {
        return res.status(500).json({error: "mysql"});
        } else if (result[0]) {
            const passwordBase = result[0].password.toString('utf-8');
            bcrypt.compare(req.body.password, passwordBase)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
            }) .catch(err => {})
            return res.status(200).json({
                userId: result[0].id,
                token: jwt.sign(
                  { userId: result[0].id,
                    isAdmin: result[0].isAdmin  },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '1h' }
                )
            });
        } else {
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
    });
};  

exports.getProfil = (req, res, next) => {
    const userId = req.user;
    const insert = [userId];

    let queryString = queryDbb.userProfil();

    connection.query(queryString, insert, (error, result, fields) => {
      if (error) {
        return res.status(500).json({error: "mysql"});
      } else {
          if (!result[0]) {
              return res.status(400).json({error: 'l\'id ne correspond pas'});
          } else {
              return res.status(200).json(result[0]);
          }
      }
    });
}

exports.updateProfil = (req, res, next) => {
    const userId = req.user;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const insert = [imageUrl,userId]

    let queryString = queryDbb.userProfilUpdate();
    
    connection.query(queryString, insert, (error, result, fields) => {
      if (error) {
        return res.status(500).json({error: "mysql"});
      } else {
            return res.status(200).json('photo mise à jour');
        }
    });
}

exports.deleteProfil = (req, res, next) => {
    const userId = req.user;
    const insert = [userId]

    let queryStringPhoto = queryDbb.userProfilPhoto();

    connection.query(queryStringPhoto, insert,(error, result, fields) => {
        if (error) {
            return res.status(500).json({error: "mysql1"});
        } else if (result.photo != null) {
            //si il y a une photo de profil
            //on récupère le nom du filename
            const filename = result[0].photo.split('/images/')[1]; 
            //on supprime le fichier du dossier images
            fs.unlink(`images/${filename}`, () => {
                //on regarde si il y a fichier avec les messages de l'utilisateur
                const queryFileMessageDelete = queryDbb.fileMessageDeleteUser();
                connection.query(queryFileMessageDelete, insert,(error, result, fields) =>{
                    if (error) {
                        return res.status(500).json({error: "mysql1"});
                    } else if (result.file != null) {
                        //si il y a des fichiers on les supprime
                        //on récupère le nom du filename
                        const filename = result[0].file.split('/images/')[1]; 
                        //on supprime le fichier du dossier images
                        fs.unlink(`images/${filename}`, () => {
                            //on supprime l'utilisateur
                            const queryStringUser = queryDbb.userDelete();
                            connection.query(queryStringUser, insert, (error, result, fields) => {
                                if (error) {
                                    return res.status(500).json({error: "mysql1"});
                                } else {
                                    return res.status(200).json('Profil supprimé');
                                }
                            })
                        })
                    } else {
                        const queryStringUser = queryDbb.userDelete();
                        connection.query(queryStringUser, insert, (error, result, fields) => {
                            if (error) {
                                return res.status(500).json({error: "mysql1"});
                            } else {
                                return res.status(200).json('Profil supprimé');
                            }
                        })
                    }
                }) 
            })
        } else {
            //si il n'y a pas de photo
            const queryFileMessageDelete = queryDbb.fileMessageDeleteUser();
            connection.query(queryFileMessageDelete, insert,(error, result, fields) =>{
                if (error) {
                    return res.status(500).json({error: "mysql1"});
                } else if (result.file != null) {
                    //si il y a des fichiers on les supprime
                    //on récupère le nom du filename
                    const filename = result[0].file.split('/images/')[1]; 
                    //on supprime le fichier du dossier images
                    fs.unlink(`images/${filename}`, () => {
                        //on supprime l'utilisateur
                        const queryStringUser = queryDbb.userDelete();
                        connection.query(queryStringUser, insert, (error, result, fields) => {
                            if (error) {
                                return res.status(500).json({error: "mysql1"});
                            } else {
                                return res.status(200).json('Profil supprimé');
                            }
                        })
                    })
                } else {
                    const queryStringUser = queryDbb.userDelete();
                    connection.query(queryStringUser, insert, (error, result, fields) => {
                        if (error) {
                            return res.status(500).json({error: "mysql1"});
                        } else {
                            return res.status(200).json('Profil supprimé');
                        }
                    })
                }
            }) 
        }
    })
}