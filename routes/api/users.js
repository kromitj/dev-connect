const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require('../../models/User')

const router = express.Router();


router.post('/register', (req, res) => { 
  User.findOne({ email: req.body.email})
  .then((user) => {
  	if(user) {
  		return res.status(400).json({ error: "Email Exists", message: "Email already being used"})
  	} else {
  		populateUserParams(req.body)		  
		  .then(userParams => {
			  const newUser = new User(userParams)
			  newUser.save()
			  .then(user => res.json(user))
			  .catch(err => console.log(err))		  	
		  })
  	}
  })
})

const populateUserParams = (reqBody) => {
	return new Promise((resolve, reject) => {
		genBcrypt(reqBody.password)
		.then((hash, err) => {
			const params = {name: reqBody.name, email: reqBody.email, avatar: gravatar.url({s: '200', r: 'pg', d: 'mm'}), password: hash };
			if (hash) { resolve(params) }
		 	else { reject(err)};		 
		})
	})
}

const genBcrypt = (password, userParams) => {
	return new Promise((resolve, reject)=>{
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (hash) { resolve(hash) }
				else { reject(err) }
			})
		})		
	})
}
module.exports = router;