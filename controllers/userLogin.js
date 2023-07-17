const bcrypt = require('bcrypt')
const User = require('../database/models/User')

// During init, checks if any accounts exist.
// If no account, `firstTimeSetup` set to true and allows creation of first account.
// All other accounts must be created by a logged in user at /users/
let firstTimeSetup = false

module.exports =
{
	init: () =>
	{
		User.find({}, { limit: 1 })
			.then(users =>
			{
				if(users == null || users.length == 0)
					firstTimeSetup = true
			})
			.catch(err => console.error('Failed to find any users during userLogin.init', err))
	},

	get: (req, res) =>
	{
		if(req.session?.userID ?? false)
			res.redirect('/') // Already logged in
		else
			res.render('login', { firstTimeSetup, production: process.env.PRODUCTION ?? false })
	},

	post: async (req, res) =>
	{
		const { username, password } = req.body

		// Search for user matching username, matching case-INsensitive regex
		let user = await User.findOne({ username: new RegExp(username, 'i') })

		if(firstTimeSetup)
		{
			user = await User.create(req.body)
			firstTimeSetup = false
		}

		if(!user)
		{
			res.status(400).json({ 'error': 'User not found' })
			return;
		}

		bcrypt.compare(password, user.password, (error, same) =>
		{
			if(!same)
			{
				res.status(400).json({ 'error': 'Incorrect password' })
				return;
			}

			req.session.userID = user._id

			// To pass through to `render` function
			req.session.renderer =
			{
				userID: req.session.userID,
				username: user.username
			}
			
			res.redirect('/')
		})
	}
}