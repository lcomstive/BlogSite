const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressEdge = require('express-edge')

require('dotenv').config()

// Database models
const Post = require('./database/models/Post')

// Set up express app
const app = new express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressEdge)
app.set('views', __dirname + '/views')

// Routing
app.get('/', async (req, res) =>
{
	let posts = await Post.find({}, /* Projections */ null, { limit: 5 })
	res.render('index', { posts })
})
app.get('/post/create', (req, res) => res.render('create-post'))
app.post('/post/create', async (req, res) =>
{
	req.body.content = req.body.content.replaceAll('\r\n', '<br>')
										.replaceAll('\n', '<br>')
	req.body.url = encodeURIComponent(req.body.title.replaceAll(' ', '-'))
	let post = await Post.create(req.body)
	console.log(JSON.stringify(post))
	res.redirect('/')
})

app.get('/post/:title', async (req, res) =>
{
	const post = await Post.findOne({ url: encodeURIComponent(req.params.title) })
	if(post != undefined)
	{
		console.log(post)
		res.render('post', { post })
	}
	else
	{
		console.log(`Could not find post '${req.params.title}'`)
		res.redirect('/')
	}
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