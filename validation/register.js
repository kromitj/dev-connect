const Validator = require('validator');
const User = require('../models/User');

const query = User.find()

module.exports = function validatRegisterInput(data) {
	let errors = {
		isValid: true,
		name: [],
		email: [],
		password: []
	};
	return new Promise((resolve, reject) => {
		emailOrNameExists(data.email, data.name, errors)
		.then((response) => {
			if (!Validator.isLength(data.name, {min: 2, max: 30})) {
				errors.isValid = false;
				errors.name.push('Name must be between 2 and 30 characters')
			}

			if (!Validator.isEmail(data.email)) {
				errors.isValid = false;
				errors.email.push('Invalid Email')
			}
			if (!Validator.isLength(data.password, {min: 7, max: 30})) {
				errors.isValid = false;
				errors.password.push('Password Needs to be between 7 and 30 characters')
			}
			if (!Validator.equals(data.password, data.password2)) {
				errors.isValid = false;
				errors.password.push("Passwords Don't match")
			}
			resolve(errors)
		}).catch(err => { reject({isValid: false, errors: err})})
	})
}

const emailOrNameExists = (email, name, errors) => {
	return new Promise(( resolve, reject) => {
		User.find({$or: [{email: email}, {name: name}]})
		.then(user => {
			if (user.length !== 0) {
				errors = emailOrName(user[0], email, name, errors)
				resolve({success: true, errors:  errors})
			} else { 
				resolve({success: false})
			}
		}).catch(err => reject(err))
	})
}

const emailOrName = (user, email, name, errors) => {
	if (user.email === email) { 
	 errors.email = 'Email already Being Used'
	 errors.isValid = false;
	}
	if (user.name === name) { 
		errors.name = 'Name already being used'
		errors.isValid = false;
	}
	return errors
} 



