const db = require('../../database');
var express = require('express');

const getParticipants = (req, res) => {
	// récupérer du front lorsque sur une chatroom et click sur (view les utilisateurs) ++ potentiellement en back get tous les id des groupes et les mettre en front en caché ???
	if(req.user.id_rooms.includes(req.params.roomId)) {
		const sql = `SELECT login FROM users INNER JOIN participants ON users.id = id_user WHERE id_room = ${req.params.roomId}`
		db.query(sql, function(error, data){
			if (error) {
				throw error;
			}
			else {
				res.send(data);
			}
		})
	}
	else {
		res.send("You have no access to this room.");
	}
}

const deleteUser = (req, res) => {
	if(req.user.id === req.params.userId) {
		const sql = `DELETE FROM participants WHERE id_room = ${req.params.roomId} AND id_user = ${req.params.userId}`
		db.query(sql, function(error, data){
			if (error) {
				throw error;
			}
			else {
				res.send(data);
			}
		})
	}
	else res.send('You cannot delete another user from the room.')
}

const getRooms = (req, res) => {
	// récupérer et afficher toutes les rooms dispo à l'user s'il y est inscrit sinon rien afficher SEULEMENT si c'est lui
	if (req.user.id === req.params.userId) {
		const sql = `SELECT rooms.id, name FROM rooms INNER JOIN participants ON id_room = rooms.id WHERE id_user = ${req.params.userId}`
		db.query(sql, function(error, data){
			if (error) throw error;
			else res.send(data);
		})
	}
	else res.status(400).send("You are not allowed to get that information.");
}

const addParticipant = (req, res) => {
	if(req.user.id_role !== 0) {
		const sql = `INSERT INTO participants(id_room, id_user) VALUES (${req.params.roomId},${req.user.id})`
		db.query(sql, function(error){
			if (error) throw error
			else res.send("Added to the chat.");
		})
	}
	else res.send("You might be banned from entering another chatroom.");
}

module.exports = {
	getParticipants,
	deleteUser,
	getRooms,
	addParticipant
}