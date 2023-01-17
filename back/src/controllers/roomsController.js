const db = require('../../database');
var express = require('express');

const getAllRooms = (req, res) => {
	const sql = `SELECT * FROM rooms WHERE id NOT IN (${req.user.id_rooms})` 
	db.query(sql, function(error, data){
		if (error) throw error;
		else res.status(200).send(data);
	})
}

// get dernier message, d'un chat name etc...dans lequel le participant est
const displayRoomsAndChat = (req, res) => {
	const sql = `SELECT rooms.id, rooms.name, messages.content FROM messages CROSS JOIN rooms ON messages.id_room = rooms.id INNER JOIN participants ON participants.id_room = rooms.id WHERE participants.id_user = ${req.user.id} AND created_at IN (SELECT MAX(created_at) FROM messages GROUP BY id_room)`
	db.query(sql, function(error, data){
		if (error) throw error;
		else res.status(200).send(data);
	})
}

module.exports = { 
	getAllRooms,
	displayRoomsAndChat
}