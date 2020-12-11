const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const discussionCtrl = require('../controllers/discussion');

router.get('/',auth, discussionCtrl.getAllDiscussion);
router.post('/',auth, discussionCtrl.createDiscussion);
router.get('/:id',auth, discussionCtrl.getOneDiscussion);
router.get('/:id/message',auth, discussionCtrl.getAllMessage);
router.get('/:id/message/:id/comment',auth, discussionCtrl.getComment);
router.post('/:id/message', auth, multer, discussionCtrl.createMessage);
router.post('/:id/message/:id/like',auth, discussionCtrl.likeMessage);
router.post('/:id/message/:id/comment',auth, discussionCtrl.commentMessage);
router.delete('/:id',auth, discussionCtrl.deleteDiscussion);
router.delete('/:id/message/:id',auth, discussionCtrl.deleteMessage);
router.delete('/:id/message/:id/comment/:id',auth, discussionCtrl.deleteComment);

module.exports = router;