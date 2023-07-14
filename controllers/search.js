const Post = require('../database/models/Post')

module.exports = async (req, res) =>
{
	let posts = await Post.find({})
	res.render('allPosts', {
		posts,
		searchQuery: req.params.query,
		auth: req.session.renderer,
		production: process.env.PRODUCTION ?? false 
	})
}