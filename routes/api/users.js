const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require('../../models/User')

// @route 	GET /api/users/test
// @desc   Test user route 
// @access Public
router.get('/test', (req, res) => res.json({blah: "blah", crazy: "Users WOrks"}) );

// @route 	POST /api/users/register
// @desc   Register user 
// @access Public
router.post('/register', (req, res) => { 
	console.log(req.body)
  User.findOne({ email: req.body.email})
  .then((user) => {
  	if(user) {
  		return res.status(400).json({ error: "Email Exists", message: "Email already being used"})
  	} else {
  		const userParams = populateUserParams(req.body);
		  genNewUser(userParams)
		  .then(newUser => {
			  newUser.save()
			  .then(user => res.json(user))
			  .catch(err => console.log(err))		  	
		  })
  	}
  })
})

const populateUserParams = (reqBody) => {
	return {
	name: reqBody.name,
	email: reqBody.email,
	avatar: gravatar.url({s: '200', r: 'pg', d: 'mm'}),
	password: reqBody.password
};
}

const genNewUser = (userParams) => {
	return new Promise((resolve, reject) => {
		genBcrypt(userParams.password)
		.then((hash) => {
			userParams.password = hash
		  newUser = new User(userParams)
			if (newUser) { 
			resolve(newUser)
			} else { reject(err)}
		})		
	})
} 

const genBcrypt = (password, userParams) => {
	return new Promise((resolve, reject)=>{
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (hash) {
					resolve(hash)
				}
				else { reject(err)}
			})
		})		
	})

}
module.exports = router;