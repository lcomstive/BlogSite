const fs = require('fs')
const path = require('path')
const Post = require('../database/models/Post')

const ImageDir = path.join(__dirname, '../public/')
const VideoExtensions = [ 'mp4', 'webm', 'ogg']

module.exports =
{
	get: (req, res) => res.render('editPost', { auth: req.session.renderer }),

	post: async (req, res) =>
	{
		req.body.url = encodeURIComponent(req.body.title.replaceAll(' ', '-'))

		req.body.isActive = req.body.isActive != undefined && req.body.isActive.toLowerCase() == 'on'
		
		if(req.files?.headerMedia)
		{
			let parentDir = '/posts/' + req.body.url.replace(/[^a-z0-9 ]/gi, '_') + '/'
	
			// Create parent directory if it doesn't exist
			if(!fs.existsSync(ImageDir + parentDir))
				fs.mkdirSync(ImageDir + parentDir, { recursive: true })
	
			// Save media to local filesystem
			let imagePath = parentDir + req.files.headerMedia.name
			await req.files.headerMedia.mv(ImageDir + imagePath, (err) => console.error(err))
			
			req.body.headerMedia = imagePath
	
			if(VideoExtensions.includes(imagePath.split('.').pop()))
				req.body.headerMediaType = 'video'
		}
	
		Post.create(req.body)
			.then(() => res.redirect(`/post/${req.body.url}`))
			.catch(err => console.error(err))
	}
}