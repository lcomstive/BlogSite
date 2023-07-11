const { default: edge } = require('edge.js') 
const User = require('../database/models/User')

module.exports = async (req, res, next) =>
{
	let user = await User.findById(req.session.userID)
	if(user == undefined)
		return res.redirect('/')
	next()
}