const jwt = require("jsonwebtoken");
const db = require('../../database');
const bcrypt = require('bcrypt');
var express = require('express');
const { refreshToken } = require("../controllers/usersController");
const app = express();


exports.signIn = (req, res, next) => {
	const tokenToUse = req.headers.token1
	const tokenRefresh = req.headers.refreshtoken;
		try {
			const mySecret = "mysecret";
			const decoded1 = jwt.verify(tokenToUse, mySecret);
			req.user = decoded1;
			try{
				const decoded2 = jwt.verify(tokenRefresh, mySecret)
				req.userRefresh = decoded2;
				next();
			}catch(err){
				return  refreshToken(decoded1.id, token => {
					res.status(417).send(token)
				})
			}
		} catch (err) {
			return res.status(401).send(err);
		}
};



