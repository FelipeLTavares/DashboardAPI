const express = require("express");

const GenericController = require("./postControllers.js");
const genericController = new GenericController();

const router = express.Router();

router.get("/post", genericController.Get);
router.post("/post", genericController.Create);
router.put("/post", genericController.Update);
router.delete("/post", genericController.Delete);

module.exports = router;
