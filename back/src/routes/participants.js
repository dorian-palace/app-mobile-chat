var express = require('express');
var router = express.Router();
var {signIn} = require('../middlewares/auth');
var {
	getParticipants, 
	deleteUser,
	getRooms,
    addParticipant
} = require('../controllers/participantsController')

//[BACK/04-get-user-from-a-group]: Une route qui récupère tous les users d'une seule room
router.get('/:roomId', signIn, getParticipants);

//[BACK/06-delete-user-from-room]: Une route qui supprime un utilisateur d'une room.
router.delete('/:roomId/:userId', signIn ,deleteUser);

//[BACK/04-19]: Une route qui récupère la liste des rooms auxquelles participe un user. 
router.get('/rooms-list/:userId', signIn, getRooms);

// [BACK/13-continuation-ticket]
router.post('/rooms-list/add/:roomId', signIn, addParticipant);

module.exports = router;