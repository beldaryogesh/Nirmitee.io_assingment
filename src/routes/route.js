const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const clotheController = require("../controllers/clotheController")
const commonMid = require("../middlewares/commonMid")





// ==> user APIs
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
// ==> clothes APIs
router.post("/createClothes", commonMid.authenticate,  commonMid.authorize, clotheController.createClotes)
router.get("/getClothes",commonMid.authenticate, clotheController.getClothes)
router.put('/clothes/:clotheId', commonMid.authenticate, commonMid.authorize, clotheController.updateClotheById)
router.delete('/clothes/:clotheId', commonMid.authenticate, commonMid.authorize, clotheController.deleteClotheById)

module.exports = router; // --> exporting the function