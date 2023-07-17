const Post = require('../database/models/Post')

module.exports =
{
	general: async (req, res) =>
	{
		let posts = await Post.find({ $text: { $search: req.params.query }})
								.sort({ createdAt: -1 })
		res.render('searchResults', {
			posts,
			searchQuery: req.params.query,
			auth: req.session.renderer,
			production: process.env.PRODUCTION ?? false 
		})
	},

	tag: async (req, res) =>
	{
		// Get all posts containing tag
		let posts = await Post.find({ tags: req.params.tag })
								.sort({ createdAt: -1 })
		res.render('searchResults', {
			posts,
			auth: req.session.renderer,
			production: process.env.PRODUCTION ?? false
		})
	}
}