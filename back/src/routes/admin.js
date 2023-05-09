var express = require('express');
var router = express.Router();
var { 
	adminUpdateRoom, 
	adminUpdateUser, 
	adminUpdateRole, 
	supressMessagesFromGreneral, 
	addNewRoom,
	deleteMessageFromRoom,
	adminDeleteRoom
} = require('../controllers/adminController')


// route supression de tous les messages BACK/???
router.get('/supress', supressMessagesFromGreneral)

// route supression d'un message d'une room spécifique BACK/16
router.delete('/chat/:roomId/:id', deleteMessageFromRoom);

// Une route qui  update le nom d'une room BACK/???
router.patch('/rooms/:id/update', adminUpdateRoom);

// Une route qui supprime une room BACK/???
router.delete('/rooms/:id', adminDeleteRoom);

// Une route qui update le login d'un user BACK/???
router.patch('/users/:id/update', adminUpdateUser);

// Une route qui update le role d'un user BACK/???
router.put('/users/:id/update/role', adminUpdateRole);

// route créer une room BACK/28
router.post('/add-room', addNewRoom)

module.exports = router;