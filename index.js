const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressEdge = require('express-edge')
const fileUpload = require('express-fileupload')

require('dotenv').config()

const ImageDir = path.join(__dirname, 'public/')
const VideoExtensions = [ 'mp4', 'webm', 'ogg']

// Database models
const Post = require('./database/models/Post')

// Set up express app
const app = new express()

app.use(fileUpload())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressEdge)
app.set('views', __dirname + '/views')

// Routing
app.get('/', async (req, res) =>
{
	let posts = await Post.find({}, /* Projections */ null, { limit: 5 })
	res.render('index', { posts })
})
app.get('/posts', async (req, res) =>
{
	let posts = await Post.find({})
	res.render('all-posts', { posts })
})

app.get('/post/create', (req, res) => res.render('create-post'))
app.post('/post/create', async (req, res) =>
{
	req.body.url = encodeURIComponent(req.body.title.replaceAll(' ', '-'))

	req.body.isActive = req.body.isActive != undefined && req.body.isActive.toLowerCase() == 'on'

	if(req.files && req.files.length > 0)
		console.log('Files:')
	for(let file in req.files)
		console.log(file)

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
})

app.get('/post/:title', async (req, res) =>
{
	const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
	if(post != undefined)
		res.render('post', { post })
	else
	{
		console.log(`Could not find post '${req.params.title}'`)
		res.redirect('/')
	}
})

app.get('/post/edit/:title', async (req, res) =>
{
	const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
	res.render('create-post', { post })
})

app.post('/post/update/:title', async (req, res) =>
{
	req.body.url = encodeURIComponent(req.body.title.replaceAll(' ', '-'))
	req.body.content = req.body.content.replaceAll('\r\n', '<br>')
										.replaceAll('\n', '<br>')

	req.body.isActive = req.body.isActive != undefined && req.body.isActive.toLowerCase() == 'on'

	console.log(req.body)

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
})

// Set up MongoDB connection
let mongoIP = process.env.MONGO_IP || "127.0.0.1"
let mongoPort = process.env.MONGO_PORT || 27017
let dbName = process.env.MONGO_DBNAME || 'blog'
mongoose.connect(`mongodb://${mongoIP}:${mongoPort}/${dbName}`, { useNewUrlParser: true })
	.then(() => console.log('Connected to Mongo'))
	.catch(err => console.error('Failed to connect to Mongo database', err))

// Start listening
let port = process.env.PORT || 3000
let sslKey = process.env.SSL_KEY
let sslCert = process.env.SSL_CERT

onServerStart = () => console.log(`Started server on port ${port}`)

if(sslKey && sslCert) // Start in HTTPS (secure) mode
{
	app.set('trust proxy', 1) // Trust first proxy
	app.enable('trust proxy')
	console.log('Starting in secure (HTTPS) mode')

	https.createServer({
		key: fs.readFileSync(sslKey),
		cert: fs.readFileSync(sslCert)
	}, app).listen(port, onServerStart)
}
else
	app.listen(port, onServerStart)