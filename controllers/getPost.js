const Post = require('../database/models/Post')

module.exports = async (req, res) =>
{
	const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
	if(post != undefined)
		res.render('post', { post, auth: req.session.renderer })
	else
	{
		console.log(`Could not find post '${req.params.title}'`)
		res.redirect('/')
	}
}