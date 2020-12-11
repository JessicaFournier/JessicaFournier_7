const fs = require('fs');
const connection = require('../connexionDatabase');
const queryDbb = require('../queryBdd');

//Création d'une discussion
exports.createDiscussion = (req, res, next) => {
  const userId = req.user;
  const title = req.body.title;
  const insert = [userId, title];

  const queryString = queryDbb.discussionCreate();

  connection.query(queryString, insert, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result);
    }
  });
};

//récupération de toutes les discussion
exports.getAllDiscussion = (req, res, next) => {
  const mysql = require('mysql');

  const queryString = queryDbb.discussionSelectAll();
  const discussion = connection.query(queryString, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result);
    }
  });
};

//récupération d'une discussion par son id
exports.getOneDiscussion = (req, res, next) => {
  const id = req.params.id;

  const insert = [id]
  const queryString = queryDbb.discussionSelectOne();
  const discussion = connection.query(queryString, insert, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result)
    }
  });
};

//suppression d'une discussion 
exports.deleteDiscussion = (req, res, next) => {
  const id = req.params.id;
  const isAdmin = req.userIsAdmin;
  const insertId = [id]

  if (isAdmin == 1) {
    //je récupère tous les id des messages de la discussion
    const queryStringSelectMessage = queryDbb.selectMessageForDiscussionDelete();
    connection.query(queryStringSelectMessage, insertId, (error, messageIds, fields) => {
      if (error) {
        return res.status(500).json({ error: "mysql1" });
      } else {
        //Pour chaque message, je supprime ses commentaires
        for (let i = 0; i < messageIds.length; i++) {
          const insert = [messageIds[i].id];
          const queryStringDelelteComment = queryDbb.commentDeleteMessageId();
          connection.query(queryStringDelelteComment, insert, (error, result, fields) => {
            if (error) {
              return res.status(500).json({ error: "mysql2" });
            } else {
              //pour chaque message je supprime les like
              for (let i = 0; i < messageIds.length; i++) {
                const insert = [messageIds[i].id];
                const queryStringDeleteLike = queryDbb.discussionDeleteLikeMessage();
                connection.query(queryStringDeleteLike, insert, (error, result, fields) => {
                  if (error) {
                    return res.status(500).json({ error: "mysql3" });
                  } else {
                    //pour chaque message, je regarde si il a un fichier
                    for (let i = 0; i < messageIds.length; i++) {
                      const insert = [messageIds[i].id];
                      const queryStringFindFile = queryDbb.fileFind();
                      connection.query(queryStringFindFile, insert, (error, result, fields) => {
                        if (error) {
                          return res.status(500).json({ error: "mysql4" });
                        } else if (result.file != null) {
                          const filename = result[0].file.split('/images/')[1];
                          //on supprime le fichier du dossier images
                          fs.unlink(`images/${filename}`, () => {
                            //je le supprime de la base
                            const queryStringFileDelete = queryDbb.fileDelete();
                            connection.query(queryStringFileDelete, insert, (error, result, fields) => {
                              if (error) {
                                return res.status(500).json({ error: "mysql5" });
                              } else {
                                //je supprime les messages
                                const queryStrinDeleteMessage = queryDbb.discussionDeleteMessage();
                                connection.query(queryStrinDeleteMessage, insertId, (error, result, fields) => {
                                  if (error) {
                                    return res.status(500).json({ error: "mysql6" });
                                  } else {
                                    //je supprime la discussion
                                    const queryStingDiscussionDelete = queryDbb.discussionDelete();
                                    connection.query(queryStingDiscussionDelete, insertId, (error, result, fields) => {
                                      if (error) {
                                        return res.status(500).json({ error: "mysql7" });
                                      } else {
                                        return res.status(200).json("Discussion supprimée");
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          })
                        } else {
                          //si il n'y a pas de fichiers je supprime les messages puis la discussion
                          const queryStrinDeleteMessage = queryDbb.discussionDeleteMessage();
                          connection.query(queryStrinDeleteMessage, insertId, (error, result, fields) => {
                            if (error) {
                              return res.status(500).json({ error: "mysql8" });
                            } else {
                              const queryStingDiscussionDelete = queryDbb.discussionDelete();
                              connection.query(queryStingDiscussionDelete, insertId, (error, result, fields) => {
                                if (error) {
                                  return res.status(500).json({ error: "mysql9" });
                                } else {
                                  return res.status(200).json("Discussion supprimée");
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  } else {
    //Si l'utilisateur n'est pas admin
    return res.status(400).json("Vous n'êtes pas autorisé à supprimer cette discussion");
  }
};

//création d'un message
exports.createMessage = (req, res, next) => {
  const userId = req.user;
  const message = req.body.text_message;
  const discussionId = req.body.discussionId;
  const date = new Date();
  
  let file = null

  if (req.file) {
      file = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  const insert = [userId, discussionId, message, date, file];

  const queryString = queryDbb.messageCreate();
  connection.query(queryString, insert, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result);
    }
  });
};

//récupération de tous les messages
exports.getAllMessage = async (req, res, next) => {
  const discussionId = req.params.id;
  const insert = [discussionId];

  const queryString = queryDbb.messageSelectAll();
 
  connection.query(queryString, insert, async (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      await Promise.all(result.map(async (r, index) => {

        const queryStringNbLike = queryDbb.messageNbLike();

        let insert2 = [r.id];

        await new Promise((resolve, reject) => {
          connection.query(queryStringNbLike, insert2, (error, nb_like, fields) => {
            if (error) {
              reject();
              return res.status(500).json({ error: error });
            } else {
              r.nbLike = nb_like[0].nb_like;
              resolve(r);
            }
          })
        });
      }))
      return res.status(200).json(result);
    }
  });
};

//suppression d'un message 
exports.deleteMessage = (req, res, next) => {
  const userId = req.user;
  const messageId = req.body.id;
  const isAdmin = req.userIsAdmin;
  const insertMessageId = [messageId];

  //1 On vérifie que l'utilisateur correspond à l'utilisateur qui a posté le message ou qu'il est admin
  const queryStringUser = queryDbb.messageUserIdBeforeDelete();
  connection.query(queryStringUser, insertMessageId, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      //Si l'utilisateur n'est pas celui qui a posté le message, on renvoie une erreur pour lui dire qu'il ne peut pas supprimer le message
      if (result[0].user_id != userId && isAdmin == 0) {
        return res.status(400).json("Vous ne pouvez pas supprimer ce message !");
      } else {
        //supression des commentaires liés au message
        const queryStringCommentDelete = queryDbb.commentDeleteMessageId();
        connection.query(queryStringCommentDelete, insertMessageId, (error, result, fields) => {
          if (error) {
            return res.status(500).json({ error: "mysql" });
          } else {
            //Suppression des likes liés au message
            const queryStringMessageLikeDelete = queryDbb.messageDeleteLike();
            connection.query(queryStringMessageLikeDelete, insertMessageId, (error, result, fields) => {
              if (error) {
                return res.status(500).json({ error: "mysql" });
              } else {
                //si l'utilisateur est celui qui a posté le message alors on vérifie si il y a un fichier avec le message
                const queryStringFile = queryDbb.fileFind();
                connection.query(queryStringFile, insertMessageId, (error, result, fields) => {
                  if (error) {
                    return res.status(500).json({ error: "mysql" });
                  } else if (result.file != null) {
                    //Si il y a un fichier
                    const filename = result[0].file.split('/images/')[1];
                    //on supprime le fichier du dossier images
                    fs.unlink(`images/${filename}`, () => {
                      //on supprime le fichier de la base
                      const queryStringFileDelete = queryDbb.fileDelete();
                      connection.query(queryStringFileDelete, insertMessageId, (error, result, fields) => {
                        if (error) {
                          return res.status(500).json({ error: "mysql" });
                        } else {
                          //on supprime le message
                          const queryStringMessageDelete = queryDbb.messageDelete();
                          connection.query(queryStringMessageDelete, insertMessageId, (error, result, fields) => {
                            if (error) {
                              return res.status(500).json({ error: "mysql" });
                            } else {
                              return res.status(200).json("Message supprimé");
                            }
                          })
                        }
                      })
                    })
                  } else {
                    const queryStringMessageDelete = queryDbb.messageDelete();
                    connection.query(queryStringMessageDelete, insertMessageId, (error, result, fields) => {
                      if (error) {
                        return res.status(500).json({ error: "mysql" });
                      } else {
                        return res.status(200).json("Message supprimé");
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
};

//Insertion d'un like
exports.likeMessage = (req, res, next) => {
  const userId = req.user
  const messageId = req.body.message_id;
  const date = new Date();
  const insertFirst = [userId, messageId, date];
  const insertMessageId = [messageId];
  const insertForDelete = [userId, messageId];

  const queryStringMessageUserLike = queryDbb.messageUserLike();
  //on va vérifier si l'utilisateur a déjà aimé le message
  connection.query(queryStringMessageUserLike,insertMessageId, (error, result, fields) =>{
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else if (result.length > 0) {
      //Si l'utilisateur a déjà aimé le like, on le supprime de la base
      if (result[0].user_id == userId) {
        const queryStringMessageDislike = queryDbb.messageUserDislike();
        connection.query(queryStringMessageDislike, insertForDelete, (error, result, fields) =>{
          if (error) {
            return res.status(500).json({ error: "mysql" });
          } else {
            return res.status(200).json("Like supprimé de la base");
          }
        })
      }
    } else {
      //si non on l'ajoute à la base
      const queryStringMessageLike = queryDbb.messageLike();
      connection.query(queryStringMessageLike, insertFirst, (error, result, fields) => {
        if (error) {
          return res.status(500).json({ error: "mysql" });
        } else {
          return res.status(200).json(result);
        }
      });
    }
  })
}


//création d'un commentaire
exports.commentMessage = (req, res, next) => {
  const userId = req.user
  const messageId = req.body.message_id;
  const comment = req.body.text_comment;
  const date = new Date();
  const insert = [userId, messageId, comment, date]

  const queryString = queryDbb.messageCommentCreate();

  connection.query(queryString, insert, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result);
    }
  });
};

//récupérations des commentaires
exports.getComment = (req, res, next) => {
  const userId = req.user
  const messageId = req.params.id;
  const insert = [messageId];

  const queryString = queryDbb.commentSelectAll();

  connection.query(queryString, insert, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      return res.status(200).json(result);
    }
  });
};

//suppression d'un commentaire 
exports.deleteComment = (req, res, next) => {
  const userId = req.user
  const commentId = req.body.id;
  const insertCommentId = [commentId];
  const insertUserId = [userId];
  const isAdmin = req.userIsAdmin;

  const queryStringUser = queryDbb.commentUserIdBeforeDelete();
  // On vérifie que l'utilisateur est celui qui a posté le commentaire ou qu'il est admin
  connection.query(queryStringUser, insertUserId, (error, result, fields) => {
    if (error) {
      return res.status(500).json({ error: "mysql" });
    } else {
      if (result[0].user_id != userId && isAdmin == 0) {
        return res.status(400).json("Vous ne pouvez pas supprimer ce message !");
      } else {
        const queryStringDeleteComment = queryDbb.commentDeleteCommentId();

        connection.query(queryStringDeleteComment, insertCommentId, (error, result, fields) => {
          if (error) {
            return res.status(500).json({ error: "mysql" });
          } else {
            return res.status(200).json("Commentaire supprimé");
          }
        });
      }
    }
  })
};