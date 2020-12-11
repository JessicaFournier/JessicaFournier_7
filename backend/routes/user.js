const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profil', auth, userCtrl.getProfil);
router.put('/profil/:id',auth, multer, userCtrl.updateProfil);
router.delete('/profil/:id',auth, userCtrl.deleteProfil);

module.exports = router;