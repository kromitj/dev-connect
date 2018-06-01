const Validator = require('validator');
const Profile = require('../models/User');
const isEmpty = require('./isEmpty');

module.exports = function validatProfileInput(data) {
	const errors = {
		isValid: true,
		handle: [],
		status: []
	};
	return new Promise((resolve, reject) => {
		data.handle = !isEmpty(data.handle) ? data.handle : '';
		data.status = !isEmpty(data.status) ? data.status : '';
		data.skills = !isEmpty(data.skills) ? data.skills : '';

		handleExists(data.handle, errors)
		.then((response) => {
			console.log("handleExists: ", response)
			if (Validator.isEmpty(data.handle)) {
				errors.isValid = false;
				errors.handle.push("Handle can't be empty")
			}
			if (!Validator.isLength(data.handle, {min: 2, max: 30})) {
				errors.isValid = false;
				errors.handle.push('Handle must be between 2 and 30 characters')
			}
			if (Validator.isEmpty(data.status)) {
				errors.isValid = false;
				errors.status.push("Status can't be empty")
			}
			
			resolve(errors)
		}).catch(err => { reject({isValid: false, errors: err})})
	})
}

const handleExists = (handle, errors) => {
	return new Promise(( resolve, reject) => {
		Profile.findOne({handle})
		.then(profile => {
			if (profile !== null) {
				console.log('Yoooooooo---------------')
				errors.isValid = false;
				errors.handle = "Handle Exists"
				resolve({success: true, errors:  errors})
			} else { 
				console.log('Yoooooooo---------------')
				resolve({success: true})
			}
		}).catch(err => reject(err))
	})
}




