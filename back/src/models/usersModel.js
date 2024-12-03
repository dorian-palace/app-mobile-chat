// const db = require('../../database');
// var express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));



// const getAllUsers = (callback) => {
//     console.log(callback);
//         const sql = 'SELECT `login` FROM users'
//         db.query(sql, function(error, data){
//             if (error) {
//                 throw error;
//             }
//             else {
//                 callback(data);
//             }
//         })
// }

// const createParticipation = () => {

//     return  Promise ((resolve, reject) =>{

//         const sql = `INSERT INTO participants (id_room, id_user) VALUES (2,1)`
//         db.query(sql, function(error, data){
//             if (error) {
//                 return reject(error);
//             }
//             else {
//                 return resolve(data);
//             }
//         })
//     })
// }



// module.exports = { createParticipation, getAllUsers}