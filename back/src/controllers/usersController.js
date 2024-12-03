const data = {};
const db = require('../../database');
// _APPDIR
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')


const registerUsers = async (req, res) => {
	const { login, password, email } = req.body;
	// Champs envoyer dans la requête	
	try {
		//Verification champs renseigné
		if (login == null || password == null || email == null) {
			return res.status(400).json({ 'error': 'missing params' });
		} else {
			//Vérification du login disponnible en base de donnée
			db.query("SELECT * FROM users WHERE login = '" + login + "'", async (err, response) => {

				if (response.length > 0) {
					//Si le login existe déjà en base de donnée on return l'erreur
					return res.status(400).json({ 'error': 'Login not valid' });
				}

				//Vérification si le mail existe en base de donnée
				db.query("SELECT * FROM users WHERE email = '" + email + "' ", async (err, response) => {

					if (response.length > 0) {
						//Si l'email existe déjà en base de donnée on return l'erreur
						return res.status(400).json({ 'error': 'email alreaddy used' });
					}

					// Hash password
					const salt = await bcrypt.genSalt()
					const hash = await bcrypt.hash(password, salt);

					// Insert user into database
					db.query(
						`INSERT INTO users (login, password, email, id_role) VALUES ("${login}", "${hash}", "${email}", 1)`, (err, response) => {
							if (err) {
								res.status(500).json({
									status: false,
									message: 'There was a problem with the query.'
								});
							}
							else {
								// send the JWT to the client
								const sql = `SELECT users.id FROM users WHERE users.login = "${login}"`
								db.query(sql, function (error, data) {
									if (error) {
										throw error;
									}
									else {
										const sql = `INSERT INTO participants (id_room, id_user) VALUES (0, ${data[0].id})`
										db.query(sql, function (error) {
											if (error) throw error;

											res.status(200).json({
												status: true,
												message: 'Inscription valider'
											});
										})
									}
								})
							}
						});
				});
			})
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
}

const authUsers = (req, res) => {
	const login = req.body.login;
	const password = req.body.password;

	db.query(`SELECT users.id, users.login, users.email, users.id_role, users.password, GROUP_CONCAT(participants.id_room) AS rooms FROM users LEFT JOIN participants ON users.id = id_user WHERE login = '${login}' GROUP BY id`, function (error, results) {
		if (results.length > 0) {
			bcrypt.compareSync(password, results[0].password, function (err, result) {
				if (result) {
					return res.send({ message: "Login Successful" });
				}
				else {
					return res.status(400).send({ message: "Invalid Password" });
				}
			});

			const rooms = results[0].rooms.split(',')

			const mySecret = "mysecret";

			const token = jwt.sign({
				login: login,
				email: results[0].email,
				id: results[0].id.toString(),
				id_role: results[0].id_role,
				id_rooms: rooms
			}, mySecret,{
				expiresIn: "30d",
				});

			const refreshToken = jwt.sign({ 
				message: "refresh Token info",
				// token: req.headers.authorization,
				email:results[0].email,
				login:login,
				id_rooms: rooms,
				id:results[0].id.toString(),
				id_role:results[0].id_role,},
				mySecret, 
				{
				expiresIn: "1m",
				}
				);
			
			res.status(200).json({
				status: true,
				token: token,
				refresh: refreshToken,
			});
		} else {
			res.status(400).send("You cannot login.")
		}
	})
}

const connectedUser = (req, res) => {
	res.status(200).json({
		user: req.user
	})
}

const refreshToken =  (id, callback) => {
	db.query(`SELECT users.id, users.login, users.email, users.id_role, users.password, GROUP_CONCAT(participants.id_room) AS rooms FROM users LEFT JOIN participants ON users.id = id_user WHERE users.id = ${id} GROUP BY id`, (err, results) => {
		if (results.length > 0) {
			const rooms = results[0].rooms.split(',')
			const mySecret = "mysecret";
			const token = jwt.sign({
				id: '2',
			}, mySecret)
			callback(token)
		}
	})
}

const getUsers = (req, res) => {
	const sql = 'SELECT `login` FROM users'
	db.query(sql, function (error, data) {
		if (error) throw error;
		else res.send(data);
	})
}

const addUserToRoom = (req, res) => {

	const verifyRoles = `SELECT role FROM  users INNER JOIN roles 
	ON roles.id = users.id_role WHERE users.id = ?`
	db.query(verifyRoles, [req.user.id] , function (error, data) {

		if (data.length !== 0)
		{
			if (data[0].role !== "ban") {

				const verifyParticipation = `SELECT id_room FROM participants WHERE id_user = ? AND id_room = ?`
				db.query(verifyParticipation, [req.user.id, req.params.idRoom], function(error,dataIdRoom)
				{
					if(dataIdRoom[0] == undefined)
					{
						var insertUser = insertToRoom(req.body.id_room, req.user.id);
						res.status(200).send({message:'Request succeed.'})
					
					} else res.status(400).send({message : 'The id user '+[req.user.id]+ ' is already related to the id room '+[req.body.id_room]+' .'});
				})
			} else res.status(400).send({ message: 'You were ban of this room.' })
		}
	})
}		

const getUserDetails = (req, res) => {
	const sql = `SELECT users.login, users.email, GROUP_CONCAT(rooms.name) AS rooms_name FROM users, rooms WHERE users.id = ${req.params.userId}`
	db.query(sql, function (error, data) {
		if (error) throw error;
		else res.send(data);
	})
}

const updateUser = (req, res) => {
	const { login, email, password, confPassword } = req.body;
	try {
		if (login != null) {
			//Si le login est remplis
			db.query("SELECT login FROM users WHERE id = '" + req.params.id + "'", (response) => {
				if (response.length > 0) {
					//Si le login est déjà pris en base de donnée return erreur
					return res.status(401).json({ 'error': 'Login not avaible' });
				} else {
					if (password === confPassword) {
						//Si la confirmation du mot de passe est valide on met a jours le login de l'utilisateurs
						res.status(200).json({
							status: true,
							message: 'Login updated'
						});
						db.query("UPDATE users set login='" + login + "' WHERE id = '" + req.user.id + "'  "), (err) => {
							if (err) {
								res.status(500).json({
									status: false,
									message: 'There was a problem with the query.'
								});
							}
						}
					} else res.status(401).json({ 'error': 'the password do not match' });
				}
			})
		} else if (email != null) {
			//Si le email est remplis
			db.query("SELECT email FROM users WHERE id = '" + req.params.id + "'", (err, response) => {
				if (response.length > 0) {
					//Si le email est déjà pris en base de donnée return erreur
					return res.status(401).json({ 'error': 'email not avaible' });
				} else {
					if (password === confPassword) {
						//Si la confirmation du mot de passe est valide on met a jours le login de l'utilisateurs
						res.status(200).json({
							status: true,
							message: 'Email updated'
					});
					db.query("UPDATE users set email='"+email+"' WHERE id = '"+req.user.id+"'  "), (err, response) => {
						if(err) {
							res.status(500).json({
								status: false,
								message: 'There was a problem with the query.'
						});						
					}
				}
			} else res.status(401).json({'error': 'the password do not match'});
		}
	})
	} else if (password != null){
			//Si le password est remplis
		db.query("SELECT password FROM users WHERE id = '"+ req.params.id +"'", (response) => {
			if(response.length > 0) {
				return res.status(401).json({'error': 'password not avaible'});
			} else {
				if (password === confPassword) {
					//Si la confirmation du mot de passe est valide on met a jours le login de l'utilisateurs et on hash
					const salt =  bcrypt.genSalt()
					const hash =   bcrypt.hash(password, salt);
					res.status(200).json({
						status: true,
						message: 'Password updated'
				});
				db.query("UPDATE users set password='"+hash+"' WHERE id = '"+req.user.id+"'  "), (err) => {
					if(err) {

					res.status(500).json({
						status: false,
						message: 'There was a problem with the query.'
					});						
				}
			}
				} else res.status(401).json({'error': 'the password do not match'});
			}
		})
	} else res.status(401).json({'error': 'Empty field'});
	} catch (error) {
		return res.status(400).send(error)
	}
}

module.exports = {
	registerUsers,
	authUsers,
	connectedUser,
	getUsers,
	authUsers,
	addUserToRoom,
	getUserDetails,
	updateUser,
	refreshToken
}
