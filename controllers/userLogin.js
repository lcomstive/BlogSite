const bcrypt = require('bcrypt')
const User = require('../database/models/User')

// During init, checks if any accounts exist.
// If no account, `firstTimeSetup` set to true and allows creation of first account.
// All other accounts must be created by a logged in user at /users/
let firstTimeSetup = false

RenderLogin = (res, error = null) =>
{
	res.render('login', {
		error,
		firstTimeSetup,
		production: process.env.PRODUCTION ?? false
	})
}

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
			RenderLogin(res)
	},

	post: async (req, res) =>
	{
		const { username, password } = req.body

		// Search for user matching username, matching case-INsensitive regex
		let user = username ? await User.findOne({ username: new RegExp(username, 'i') }) : null

		if(firstTimeSetup)
		{
			user = await User.create(req.body)
			firstTimeSetup = false
		}

		if(!user)
		{
			RenderLogin(res, 'User not found')
			return;
		}

		bcrypt.compare(password, user.password, (error, same) =>
		{
			if(!same)
			{
				RenderLogin(res, 'Incorrect password')
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