const express = require("express");

const UsersController = require("./usersControllers.js");
const LoginsController = require("./loginController.js");
const usersController = new UsersController();
const loginsController = new LoginsController();

const router = express.Router();

router.get("/user", loginsController.Get);

router.post("/user", usersController.Create);
router.put("/user", usersController.Update);
router.delete("/user", usersController.Delete);

module.exports = router;
