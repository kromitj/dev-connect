const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const Admin = mongoose.model('Admin');
const jwsSecret = require('./keys').jwsSecret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwsSecret;

module.exports = passport => {
	passport.use(
		new JwtStrategy(opts, (jwtPayload, done) => {
			console.log("Payload: ")
			console.log(jwtPayload)
			Admin.findById(jwtPayload.id)
			.then(admin => {
				if (admin) {
					return done(null, admin)
				} else { return done(null, false)}
			}).catch(err => console.log(err))
		})
	)
}