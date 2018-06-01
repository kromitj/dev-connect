const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfileInput = require('../../validation/profile');

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
	
	profileFields.social = {};
	// if(body.social.youtube) profileFields.social.youtube = body.social.youtube;
	// if(body.social.twitter) profileFields.social.twitter = body.social.twitter;
	// if(body.social.facebook) profileFields.social.facebook = body.social.facebook;
	// if(body.social.linkedin) profileFields.social.linkedin = body.social.linkedin;
	// if(body.social.instagram) profileFields.social.instagram = body.social.instagram;
  
  // Update existing Profile
  Profile.findOne({user: req.user.id})
  .then(profile => {
  	if (profile) {
  		Profile.findOneAndUpdate(
  			{user: req.user.id},
  			{$set: profileFields}, 
  			{new: true})
  	} else {
  		console.log("Creating New Profile")
  		// Create a new Profile
  		// Check for unique handle
  		validateProfileInput(profileFields)
  		.then(errors => {
  			if (errors.isValid) {
					new Profile.save().then(profile => res.json(profile))
  			} else {
  				return res.status(400).json({success: false, errors: errors})
  			}
  		})
  	}
  })
});

module.exports = router;