const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passport = require("passport");

const jwsSecret = require('../../config/keys').jwsSecret;

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


const User = require('../../models/User')

const router = express.Router();


router.post('/register', (req, res) => { 
  validateRegisterInput(req.body)
  .then( errors => {
	  if (errors.isValid) {
		  populateUserParams(req.body)
		  .then(userParams => {
			  const newUser = new User(userParams)
			  newUser.save()
			  .then(user => res.json({success: true, user: user.basicInfo}))
			  .catch(err => {		  	
			  	return res.status(500).json({success: false, errors: err})
		  	})  	
	  	})
	  }else {
	  	return res.status(400).json({success: false, errors: errors})
	  } 
  })
})

router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body)
	if (isValid) {
		const { name, password } = req.body;
		User.findOne({name})
		.then(user => {
			if(!user) { res.status(404).json({success: false, error: "Invalid Email Or Password", message: "Password or EMAIL is incorrect"})}
			bcrypt.compare(password, user.password)
			.then(isMatch => {
				if (isMatch) {
					jwt.sign(user.basicInfo, jwsSecret, { expiresIn: 3600}, (err, token) => {
						res.json({
							success: true,
							token: "Bearer " + token
						})					
					})
				}	else { res.json({success: false, error: "Invalid Email or PASSWORD", message: "Password or Email is incorrect"})}
			})
		})	
	} else {
		return res.status(400).json({success: false, errors: errors})
	}
})

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
	res.json({success: true, user: req.user})
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