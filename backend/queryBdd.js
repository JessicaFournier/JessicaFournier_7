
module.exports = {
    //création d'un user
    userCreate: function() {
        return 'INSERT INTO User(name, firstName, email, password, photo) VALUES (?,?,?,?,?)'
    },

    //vérification email unique
    userEmailUnique: function() {
        return 'SELECT email FROM User WHERE email = ?'
    },

    //récupération d'un utilisateur pour le login
    userLogin: function() {
        return 'SELECT * FROM User WHERE email = ? '
    },

    //récupération d'un utilisateur pour le profil
    userProfil: function() {
        return 'SELECT name, firstName, photo FROM User WHERE id=?'
    },

    //mise à jour de la photo de profil
    userProfilUpdate: function() {
        return 'UPDATE User SET photo=? WHERE id=?'
    },

    //récupération de la photo de profil
    userProfilPhoto: function() {
        return 'SELECT photo FROM User WHERE id = ?'
    },

    //supprime les commentaires liés à un utilisateur
    userCommentDelete:function() {
        return 'DELETE FROM Comment WHERE user_id = ?'
    },

    //supprime les messages liés à un utilisateur
    userMessageDelete:function() {
        return 'DELETE FROM Message WHERE user_id = ?'
    },

    //supprime l'utilisateur
    userDelete:function() {
        return 'DELETE FROM User WHERE id=?'
    },

    //creation de la discussion
    discussionCreate: function() {
        return 'INSERT INTO Discussion(user_id,title) VALUES (?,?)'
    },

    // récupération de toutes les discussions
    discussionSelectAll: function() {
        return 'SELECT title,id FROM Discussion'
    },

    // récupération d'une discussion
    discussionSelectOne: function() {
        return 'SELECT title FROM Discussion WHERE id=?'
    },

    // supression d'une discussion
    discussionDelete: function() {
        return 'DELETE FROM Discussion WHERE id=?'
    },

    //création d'un message
    messageCreate: function() {
        return 'INSERT INTO Message(user_id,discussion_id,text_message,date,file) VALUES (?,?,?,?,?)'
    },

    //récupération de tous les messages
    messageSelectAll: function() {
        return 'SELECT Message.text_message, User.name, User.firstName, User.photo, Discussion.title, Discussion.id, Message.date, Message.id, Message.file FROM Message INNER JOIN Discussion ON Message.discussion_id = Discussion.id INNER JOIN User ON Message.user_id = User.id WHERE Discussion.id = ? ORDER BY Message.date DESC' 
    },

    //supression d'un fichier à partir de l'id du message
    fileDelete: function() {
        return 'SELECT file FROM Message WHERE id=?'
    },

    //supression d'un fichier à partir de l'id du message
    UserDeleteFile: function() {
        return 'SELECT file FROM Message WHERE user_id=?'
    },

    //Vérification du userId avant de supprimer un message
    messageUserIdBeforeDelete: function() {
        return 'SELECT user_id FROM Message WHERE id=?'
    },

    //Supression d'un message
    messageDelete: function() {
        return 'DELETE FROM Message WHERE id=?'
    },

    //suppression d'un commentaire a partir du message_id
    commentDeleteMessageId: function() {
        return 'DELETE FROM Comment WHERE message_id=?'
    },

    //suppression d'un commentaire à partir de l'id du commentaire
    commentDeleteCommentId: function() {
        return 'DELETE FROM Comment WHERE id=?'
    },

    //récupération d'un fichier
    fileFind: function() {
        return 'SELECT file FROM Message WHERE id = ?'
    },

    //création d'un commentaire sur un message
    messageCommentCreate: function() {
        return 'INSERT INTO Comment(user_id,message_id,text_comment,date_comment) VALUES (?,?,?,?)'
    },

    //récupération des commentaires pour un message
    commentSelectAll: function() {
        return 'SELECT Comment.text_comment, User.name, User.firstName, Comment.date_comment, Comment.message_id, Comment.id, User.photo FROM Comment INNER JOIN Message ON Comment.message_id = Message.id INNER JOIN User ON Comment.user_id = User.id WHERE Message.id = ? ORDER BY Comment.date_comment ASC'
    },

    //Vérification de l'utilisateur avant la suppression d'un message
    commentSelectUserIdBeforeDelete: function() {
        return 'SELECT user_id FROM Comment WHERE id=?'
    },

    //insertion d'un utilisateur qui aime un message
    messageLike: function() {
        return 'INSERT INTO Liked(user_id, message_id, liked_date) VALUES(?, ?, ?)'
    },

    //Compte le nombre d elike pour un message
    messageNbLike: function() {
        return 'SELECT COUNT(*) AS nb_like FROM Liked WHERE message_id = ?'
    },

    //Selectionne l'id de l'utilisateur qui aime un message
    messageUserLike: function() {
        return 'SELECT user_id FROM Liked WHERE message_id = ?'
    },

    messageUserDislike:function() {
        return 'DELETE FROM Liked WHERE user_id=? AND message_id= ?'
    },

    //Supression des likes pour un message_id
    messageDeleteLike: function() {
        return 'DELETE FROM Liked WHERE message_id=?'
    },

    //Suppression des likes lors de la supression du profil
    messageLikeDeleteProfil: function() {
        return 'DELETE FROM Liked WHERE  user_id = ?'
    },

    //Sélection des id de messages en fonction de la discussion
    selectMessageForDiscussionDelete: function() {
        return 'SELECT id FROM Message WHERE discussion_id = ?'
    },

    discussionDeleteMessage: function() {
        return 'DELETE FROM Message WHERE discussion_id = ?'
    },

    discussionDeleteLikeMessage:function () {
        return 'DELETE FROM Liked WHERE message_id= ?'
    },

    fileMessageDeleteUser: function () {
        return 'SELECT file FROM Message WHERE user_id = ?'
    },

    selectIdFromUser: function() {
        return 'SELECT id FROM User WHERE id=?'
    },
}
