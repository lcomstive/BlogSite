const Post = require('../database/models/Post')

const MaxPosts = 5

module.exports = async (req, res) =>
{
	let posts = await Post.find({}, /* Projections */ null, { limit: MaxPosts })
	res.render('index', { posts, auth: req.session.renderer, production: process.env.PRODUCTION ?? false })
}