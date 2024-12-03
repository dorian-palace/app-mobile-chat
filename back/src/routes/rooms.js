var express = require('express');
var router = express.Router();
var {signIn} = require('../middlewares/auth');
var {
	getAllRooms, 
} = require('../controllers/roomsController')

//[BACK/04]: Une route qui retourne toutes les rooms
router.get('/', signIn, getAllRooms);

module.exports = router;