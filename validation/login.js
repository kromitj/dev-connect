const Validator = require('validator');
const User = require('../models/User');

module.exports = function validateLoginInput(data) {
	let errors = {
		name: [],
		password: []
	};
	let isValid = true;
	if (data.name === undefined || Validator.isEmpty(data.name)) {
		isValid = false;
		errors.name.push("Name field cannot be emtpy")
	}
	if (data.password === undefined || Validator.isEmpty(data.password)) {
		isValid = false;
		errors.password.push("Password field cannot be emtpy")
	}
	return {
		errors: errors,
		isValid: isValid
	}
}

