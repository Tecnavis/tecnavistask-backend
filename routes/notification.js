// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("../controller/notification");
router.post("/", Controller.create);
router.get("/", Controller.getAll);
router.delete("/:id", Controller.delete);


module.exports = router;
