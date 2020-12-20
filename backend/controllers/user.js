//Imports
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const queryDbb = require('../queryBdd');

//Constant
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

//Controlers

//sauvegarde un nouvel utilisateur, hash le mot de passe
exports.signup = async (req, res, next) =>  {
    const name = req.body.name;
    const firstName = req.body.firstName;
    const email = req.body.email;
    let password = req.body.password;
    let photo = null

    //On vérifie si un fichier a été envoyé
    if (req.file) {
        photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    
    //on vérifie si l'email est correct
    if (!emailRegex.test(email)) {
        return res.status(400).json({'error': 'l\'email n\'est pas valide'})
    }

    //on vérifie si le mot de passe correspond aux critères
    if(!passwordRegex.test(password)) {
        return res.status(400).json({'error': 'mot de passe non valide : il doit contenir entre 4 et 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre'})
    }

    //on vérifie si les champs ne sont pas vides
    if (name == null || firstName == null || email == null || password == null) {
        return res.status(400).json({'error' : 'items manquants'});
    }
    
    const insertEMail = [email];
    
    const resultUser = await queryDbb.userEmailUnique(insertEMail);
    try {
        if(resultUser.length>0) {
            if (resultUser[0].email == email) {
                return res.status(400).json({'error': 'l\'email est déjà utilisé !'})
            }
        } else {
            // hachage du mot de passe, salage par 10
            bcrypt.hash(password, 10)
            .then(async (hash) => {
                password = hash;
                const insert = [name, firstName, email, password, photo];

                let resultInsert = await queryDbb.userCreate(insert);
                return res.status(200).json(resultInsert);
                
            })
            .catch(error => res.status(500).json({ error }));
        }
    } catch (err) {
        return res.status(500).json({error: "mysql"}); 
    }
    
};


//vérifie si l'utilisateur existe, si oui, on vérifie le mot de passe. Si celui ci est correct, on renvoie un tokenn contenant l'ID de l'utilisateur
//sinon on renvoie une erreur
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const insert = [email];

    let result = await queryDbb.userLogin(insert);
    try {
        if (result[0]) {
            const passwordBase = result[0].password.toString('utf-8');
            bcrypt.compare(password, passwordBase)
            .then(resultTest => {
                if (resultTest == false) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                } else {
                    return res.status(200).json({
                        userId: result[0].id,
                        token: jwt.sign(
                        { userId: result[0].id,
                            isAdmin: result[0].isAdmin  },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '1h' }
                        )
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
    } catch (err) {
        return res.status(500).json({error: "mysql"});
    }
};  

//récupération du profil
exports.getProfil = async (req, res, next) => {
    const userId = req.user;
    const insert = [userId];

    let result = await queryDbb.userProfil(insert);
    try {
        if (!result[0]) {
            return res.status(400).json({error: 'l\'id ne correspond pas'});
        } else {
            return res.status(200).json(result[0]);
        }
    } catch (err) {
        return res.status(500).json({error: "mysql"});
    }
}

//mise à jour de la photo de profil
exports.updateProfil = async (req, res, next) => {
    const userId = req.user;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const insert = [imageUrl,userId];
    const insertId = [userId];

    const resultPhoto = await queryDbb.userProfilPhoto(insertId);
    if (resultPhoto[0].photo !== null) {
        //si il y a une photo de profil
        //on récupère le nom du filename
        const filename = resultPhoto[0].photo.split('/images/')[1]; 
        //on supprime le fichier du dossier images
        fs.unlinkSync(`./images/${filename}`);
    }

    await queryDbb.userProfilUpdate(insert);
    try {
        return res.status(200).json({message:'photo mise à jour'});
    } catch (err) {
        return res.status(500).json({error: "mysql"});
    }
}

//suppression du profil
exports.deleteProfil = async (req, res, next) => {
    const userId = req.user;
    const insert = [userId]

    //on vérifie si il y a une photo de profil
    let resultPhoto = await queryDbb.userProfilPhoto(insert);
    if (resultPhoto[0].photo !== null) {
        //si il y a une photo de profil
        //on récupère le nom du filename
        const filename = resultPhoto[0].photo.split('/images/')[1]; 
        //on supprime le fichier du dossier images
        fs.unlinkSync(`./images/${filename}`);
    }

    //on vérifie si il y a des photos dans les messages de l'utilisateur
    const resultFile = await queryDbb.fileMessageDeleteUser(insert);
    console.log(resultFile)
    console.log(resultFile.length)
    if (resultFile.length > 0) {
        //si il y a des fichiers on les supprime
        //on récupère le nom du filename
        const filename = resultFile[0].file.split('/images/')[1]; 
        //on supprime le fichier du dossier images
        fs.unlinkSync(`./images/${filename}`); 
    } 

    try {
    //on supprime l'utilisateur
    await queryDbb.userDelete(insert);
    return res.status(200).json('Profil supprimé');
    } catch (err) {
    return res.status(500).json({error: "mysql1"});
    }
}