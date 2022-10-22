const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const restrictor = require("../middlewares/restrictor");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/user", restrictor, userCtrl.user);

module.exports = router;
