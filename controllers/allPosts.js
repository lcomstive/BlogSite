const Post = require('../database/models/Post')

module.exports = async (req, res, viewName) =>
{
	let posts = await Post.find({})
	res.render(viewName, { posts, auth: req.session.renderer, production: process.env.PRODUCTION ?? false })
}