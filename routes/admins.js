var express = require('express');
var router = express.Router();
const Controller = require('../controller/admins')
const Authentication = require('../middleware/auth')
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

//admin signup and login routes
router.post('/',upload.single("image"),Controller.create)
router.get('/',Controller.getAll)
router.get('/:id',Controller.get)
router.put('/:id',upload.single("image"),Controller.update)
router.delete('/:id',Controller.delete)
router.delete('/',Controller.deleteAll)
router.post('/login',Controller.login)
router.post('/forgot-password',Controller.forgotPassword);
router.post('/reset-password',Controller.resetPassword);
router.put('/block/:id', Controller.toggleBlockAdmin);
router.put('/unblock/:id',Controller.unblockAdmin);
router.put('/change-password/:adminId', Controller.changePassword);
module.exports = router;
