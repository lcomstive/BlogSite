const Post = require('../database/models/Post')

module.exports = async (req, res) =>
{
	const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
	if(post != undefined)
	{
		if(post.isActive || req.session.userID)
		{
			res.render('post', { post, auth: req.session.renderer })
			return
		}
	}

	res.redirect('/')
}