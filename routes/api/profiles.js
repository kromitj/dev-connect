const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");


const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route 	GET /api/profile/test
// @desc   Test proifile route 
// @access Public
router.get('/test', (req, res) => res.json({blah: "blah", crazy: "Profile Works"}) );

// @route 	GET /api/profile/
// @desc   Return current users profile
// @access Prive
router.get('/' , passport.authenticate('jwt', { session: false}), (req, res) => {

	const errors = {};
	Profile.findOne({user: req.user.id})
	.then(profile => {
		if (!profile) {
			errors.noProfile = "There is No Profile for this User"
			return res.status(404).json(errors)
		}
		res.json(profile)
	})
	.catch(err => res.status(404).json(err))
});

// @route 	POST /api/profile/
// @desc   Create a the current users profile
// @access Private
router.post('/' , passport.authenticate('jwt', { session: false}), (req, res) => {
	const profileFields = {};
	const body = req.body;
	profileFields.user = req.user.id;
	if(body.handle) profileFields.handle = body.handle;
	if(body.company) profileFields.company = body.company;
	if(body.website) profileFields.website = body.website;
	if(body.location) profileFields.location = body.location;
	if(body.status) profileFields.status = body.status;
	if(typeof body.skills !== 'undefined') profileFields.skills = body.skills.split(',');
	if(body.bio) profileFields.bio = body.bio;
	if(body.githubusername) profileFields.githubusername = body.githubusername;


	
	
});
const packProfileFields = (fields => {

})
module.exports = router;