const bcrypt = require('bcrypt')
const User = require('../database/models/User')

module.exports =
{
	get: async (req, res) => res.render('profile', { auth: req.session.renderer }),
	
	getAll: async (req, res) =>
	{
		let users = await User.find({})
		res.render('users', { users, auth: req.session.renderer })	
	},

	update: (req, res) =>
	{
		bcrypt.hash(req.body.password, 10, async (err, encrypted) =>
		{
			if(err)
			{
				console.error(`Failed to encrypt password for '${req.session.renderer.username}'`, err)
				res.json(err)
			}
			else
				await User.findOneAndUpdate({ _id: req.session.userID }, { password: encrypted })
			res.redirect('/profile')
		})
	},

	addNew: async (req, res) =>
	{
		let existing = await User.findOne({ username: req.body.username })
		if(!existing)
			await User.create(req.body)
		res.redirect('/users')
	}
}