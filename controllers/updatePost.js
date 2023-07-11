const Post = require('../database/models/Post')

module.exports =
{
	get: async (req, res) =>
	{
		const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
		res.render('editPost', { post })
	},

	post: async (req, res) =>
	{
		req.body.url = encodeURIComponent(req.body.title.replaceAll(' ', '-'))
		req.body.content = req.body.content.replaceAll('\r\n', '<br>')
											.replaceAll('\n', '<br>')

		req.body.isActive = req.body.isActive != undefined && req.body.isActive.toLowerCase() == 'on'

		if(req.files?.headerMedia)
		{
			let parentDir = '/posts/' + req.body.url.replace(/[^a-z0-9 ]/gi, '_') + '/'

			// Create parent directory if it doesn't exist
			if(!fs.existsSync(ImageDir + parentDir))
				fs.mkdirSync(ImageDir + parentDir, { recursive: true })

			// Save media to local filesystem
			let imagePath = parentDir + req.files.headerMedia.name
			
			if(!fs.existsSync(imagePath))
				await req.files.headerMedia.mv(ImageDir + imagePath, (err) => console.error(err))
			
			req.body.headerMedia = imagePath

			// Check if file extension is a video extension 
			if(VideoExtensions.includes(imagePath.split('.').pop()))
				req.body.headerMediaType = 'video'
		}

		Post.findOneAndUpdate({ url: encodeURIComponent(req.params.title) }, req.body)
			.then(() => res.redirect(`/post/${req.body.url}`))
			.catch(err => console.error(err))
	}
}