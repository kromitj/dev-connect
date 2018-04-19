const express = require("express");
const router = express.Router();


// @route 	GET /api/users/test
// @desc   Test user route 
// @access Public
router.get('/test', (req, res) => res.json({blah: "blah", crazy: "Users WOrks"}) );

module.exports = router;