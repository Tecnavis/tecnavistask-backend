var express = require('express');
var router = express.Router();
const Controller = require('../controller/logo')
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/logo', upload.single("image"), Controller.createLogo);
router.get('/logo', Controller.getAllLogo);
router.delete('/logo', Controller.deleteLogo);
router.put('/logo/:id', upload.single("image"), Controller.updateLogo);
module.exports = router;
