const fs = require('fs');
const queryDbb = require('../queryBdd');

//Création d'une discussion
exports.createDiscussion = async (req, res, next) => {
  const userId = req.user;
  const title = req.body.title;
  const insert = [userId, title];

  const result = await queryDbb.discussionCreate(insert);
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//récupération de toutes les discussion
exports.getAllDiscussion = async (req, res, next) => {

  const result = await queryDbb.discussionSelectAll();
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//récupération d'une discussion par son id
exports.getOneDiscussion = async (req, res, next) => {
  const id = req.params.id;
  const insert = [id];

  const result = await queryDbb.discussionSelectOne(insert);
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//suppression d'une discussion 
exports.deleteDiscussion = async (req, res, next) => {
  const id = req.params.id;
  const isAdmin = req.userIsAdmin;
  const insertId = [id]

  if (isAdmin == 1) {
    //je récupère tous les id des messages de la discussion
    const messageIds = await queryDbb.selectMessageForDiscussionDelete(insertId);

    for (let i = 0; i < messageIds.length; i++) {
      const insert = [messageIds[i].id];

      let queryStringFindFile = await queryDbb.fileFind(insert);

      if (queryStringFindFile[0].file !== null) {
        const filename = queryStringFindFile[0].file.split('/images/')[1];
        fs.unlinkSync(`./images/${filename}`);
      }

      try {
        await queryDbb.commentDeleteMessageId(insert);
        await queryDbb.discussionDeleteLikeMessage(insert);
        await queryDbb.discussionDeleteMessage(insertId);
        await queryDbb.discussionDelete(insertId);
      } catch ( err ) {
        return res.status(500).json({ error: "mysql" });
      }
    }

    return res.status(200).json("Discussion supprimée");

  } else {
    //Si l'utilisateur n'est pas admin
    return res.status(400).json({error: "Vous n'êtes pas autorisé à supprimer cette discussion"});
  }
};

//création d'un message
exports.createMessage = async (req, res, next) => {
  const userId = req.user;
  const message = req.body.text_message;
  const discussionId = req.body.discussionId;
  const date = new Date();
  
  let file = null

  if (req.file) {
      file = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  const insert = [userId, discussionId, message, date, file];

  const result = await queryDbb.messageCreate(insert);
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//récupération de tous les messages
exports.getAllMessage = async (req, res, next) => {
  const discussionId = req.params.id;
  const insert = [discussionId];

  const result = await queryDbb.messageSelectAll(insert);
  
    for (let i=0; i < result.length; i++) {
      let insert2 = [result[i].id];
      const nb_like = await queryDbb.messageNbLike(insert2);

      try {
        result[i].nbLike = nb_like[0].nb_like;
      } catch (err) {
        return res.status(500).json({ error: error });
      }
    } 
    return res.status(200).json(result);
    
  
};

//suppression d'un message 
exports.deleteMessage = async (req, res, next) => {
  const userId = req.user;
  const messageId = req.body.id;
  const isAdmin = req.userIsAdmin;
  const insertMessageId = [messageId];

  //1 On vérifie que l'utilisateur correspond à l'utilisateur qui a posté le message ou qu'il est admin
  const result = await queryDbb.messageUserIdBeforeDelete(insertMessageId);
  
  
  try {
    //Si l'utilisateur n'est pas celui qui a posté le message, on renvoie une erreur pour lui dire qu'il ne peut pas supprimer le message
    if (result[0].user_id != userId && isAdmin == 0) {
      return res.status(400).json({message: "Vous ne pouvez pas supprimer ce message !"});
    }

    await queryDbb.commentDeleteMessageId(insertMessageId);
    await queryDbb.messageDeleteLike(insertMessageId);

    const queryStringFile = await queryDbb.fileFind(insertMessageId);
    if (queryStringFile[0].file !== null) {
      const filename = queryStringFile[0].file.split('/images/')[1];
      fs.unlinkSync(`./images/${filename}`);              
    }
    
    await queryDbb.messageDelete(insertMessageId);

    return res.status(200).json({"message": "Message supprimé"});
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
    
};

//Insertion d'un like
exports.likeMessage = async (req, res, next) => {
  const userId = req.user
  const messageId = req.body.message_id;
  const date = new Date();
  const insertFirst = [userId, messageId, date];
  const insertMessageId = [messageId];
  const insertForDelete = [userId, messageId];

  const resultUser = await queryDbb.messageUserLike(insertMessageId);
  //on va vérifier si l'utilisateur a déjà aimé le message
  try {
      //Si l'utilisateur a déjà aimé le like, on le supprime de la base
      if (resultUser.length > 0 && resultUser[0].user_id == userId) {
        await queryDbb.messageUserDislike(insertForDelete);
        return res.status(200).json({message: "Like supprimé de la base"});
      } else {
        //si non on l'ajoute à la base
        const result = await queryDbb.messageLike(insertFirst);
        return res.status(200).json(result);
      }
  } catch ( err ) {
    return res.status(500).json({ error: "mysql" });
  }
}


//création d'un commentaire
exports.commentMessage = async (req, res, next) => {
  const userId = req.user
  const messageId = req.body.message_id;
  const comment = req.body.text_comment;
  const date = new Date();
  const insert = [userId, messageId, comment, date]

  const result = await queryDbb.messageCommentCreate(insert);
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//récupérations des commentaires
exports.getComment = async (req, res, next) => {
  const userId = req.user
  const messageId = req.params.id;
  const insert = [messageId];

  const result = await queryDbb.commentSelectAll(insert);
  try {
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};

//suppression d'un commentaire 
exports.deleteComment = async (req, res, next) => {
  const userId = req.user
  const commentId = req.body.id;
  const isAdmin = req.userIsAdmin;
  const insertCommentId = [commentId];
  
  const result = await queryDbb.commentSelectUserIdBeforeDelete(insertCommentId);
  // On vérifie que l'utilisateur est celui qui a posté le commentaire ou qu'il est admin
  if (result[0].user_id != userId && isAdmin == 0) {
    return res.status(400).json({message: "Vous ne pouvez pas supprimer ce commentaire !"});
  }
  try {
    await queryDbb.commentDeleteCommentId(insertCommentId);
    return res.status(200).json({message: "Commentaire supprimé"});
  } catch (err) {
    return res.status(500).json({ error: "mysql" });
  }
};