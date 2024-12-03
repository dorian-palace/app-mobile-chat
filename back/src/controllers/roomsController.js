const db = require('../../database');
var express = require('express');

const getAllRooms = (req, res) => {
	const sql = `SELECT * FROM rooms WHERE id NOT IN (${req.user.id_rooms})` 
	db.query(sql, function(error, data){
		if (error) throw error;
		else res.send(data);
	})
}

module.exports = { 
	getAllRooms
}