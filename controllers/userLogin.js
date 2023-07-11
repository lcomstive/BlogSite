const bcrypt = require('bcrypt')
const User = require('../database/models/User')

module.exports =
{
	get: (req, res) =>
	{
		if(req.session?.userID ?? false)
			res.redirect('/') // Already logged in
		else
			res.render('login')
	},

	post: async (req, res) =>
	{
		const { username, password } = req.body

		// Search for user matching username, matching case-INsensitive regex
		let user = await User.findOne({ username: new RegExp(username, 'i') })

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