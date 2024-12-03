var express = require('express');
var {signIn} = require('../middlewares/auth');
var router = express.Router();
var {
	postMessage,
	postMessageinChat, 
	deleteMessage,
	updateMessage,
    specificChat,
    getMessagesinGlobalChat
} = require('../controllers/messagesController')

//[BACK/09-send-message-global-chat]: Une route qui poste sur le chat global .
router.post('/', signIn, postMessage);

//[BACK/10]: Une route qui poste sur un chat spé.
router.post('/:roomId', signIn, postMessageinChat);

//[BACK/18-delete-own-messafe]: Une route qui delete un message.
router.delete('/delete/:messageId', signIn, deleteMessage);

//[BACK/17-modify-own-message]: Une route qui update un message 
router.post('/edit/:messageId', signIn, updateMessage);

//[BACK/27-get-message-chat-room]: Une route GET tous les message d'un chat spécifique.
router.get('/get/:roomId', signIn, specificChat);

// [BACK/26 correction to the ticket] Une route qui get tous les messages du chat global
router.get('/', signIn, getMessagesinGlobalChat);

module.exports = router;