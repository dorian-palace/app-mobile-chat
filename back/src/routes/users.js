const db = require('../../database')
var express = require('express');
var { signIn } = require('../middlewares/auth');

var router = express.Router();

var {
	registerUsers,
	authUsers,
	connectedUser,
	addUserToRoom,
	getUsers,
	getUserDetails,
	getUserRole,
	updateUser,
	refreshToken,
	updateAvatar,
	getAllFromUsers
} = require('../controllers/usersController')


//[BACK/01-inscription]: Une route qui inscrit les utilisateurs 
router.post('/inscription', registerUsers);

//[BACK/02 verif token and secure route for connected users]
router.get('/signin', signIn, connectedUser);

//route [BACK/27] verif token and refresh token if user is connected
router.get('/refresh', signIn, refreshToken)

//route [BACK/02 connexion de l'user et attribution du token]
router.post('/auth', authUsers)

//[BACK/03-get-all-users]: Une route qui retourne tous les utilisateurs dans une liste contenant les champs prenom et nom.
router.get('/', getUsers);

router.get('/role/:login', getUserRole);

// Une route qui retourne toutes les infos de tous les utilisateurs
router.get('/all', getAllFromUsers);

//[BACK/05-post-user-to-a-room]: Permet d'ajouter un user à une room. 
router.post('/room/:idRoom', signIn, addUserToRoom);
// ajouter un idRoom à la suite de cette route

//[BACK/07] get the details from 1 user
router.get('/details/:userId', signIn, getUserDetails);

//[BACK/08-update-user]: Une route qui permet de mettre à jour les informations des utilisateurs
router.post('/update', signIn, updateUser);

//[FRONT/20-add-new-profil] patch avatar pic for the current user
router.patch('/:userId/avatar', signIn, updateAvatar);


module.exports = router;