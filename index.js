const fs = require('fs')
const https = require('https')
const edge = require('edge.js')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressEdge = require('express-edge')
const mongoStore = require('connect-mongo')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')

const auth = require('./middleware/auth')

require('dotenv').config()

// Set up MongoDB connection
let mongoIP = process.env.MONGO_IP || "127.0.0.1"
let mongoPort = process.env.MONGO_PORT || 27017
let dbName = process.env.MONGO_DBNAME || 'blog'
mongoose.connect(`mongodb://${mongoIP}:${mongoPort}/${dbName}`,
					{ useNewUrlParser: true, autoIndex: !process.env.PRODUCTION })
	.then(() => console.log('Connected to Mongo'))
	.catch(err => console.error('Failed to connect to Mongo database', err))

// Set up express app
const app = new express()

app.use(expressEdge)
app.use(bodyParser.json())
app.use(express.static('public'))
app.set('views', __dirname + '/views')
app.use(fileUpload({ createParentPath: true }))
app.use(bodyParser.urlencoded({ extended: true }))

// Session setup
app.use(expressSession({
	resave: false,
	secure: true,
	saveUninitialized: false,
	secret: process.env.EXPRESS_SECRET || 'SuperSecretExpressSecret',
	store: mongoStore.create({ client: mongoose.connection.getClient() })
}))

// Routing
app.get('/', require('./controllers/homePage'))

const allPosts = require('./controllers/allPosts')
app.get('/posts', (req, res) => allPosts(req, res, 'allPosts'))
app.get('/drafts', auth, (req, res) => allPosts(req, res, 'allDrafts'))

const newPost = require('./controllers/newPost')
app.get('/post/new', auth, newPost.get)
app.post('/post/create', auth, newPost.post)

app.get('/post/:title', require('./controllers/getPost'))

const editPost = require('./controllers/updatePost')
app.get('/post/edit/:title', auth, editPost.get)
app.post('/post/update/:title', auth, editPost.post)

const userLogin = require('./controllers/userLogin')
userLogin.init()
app.get('/login', userLogin.get)
app.post('/login', userLogin.post)

const userController = require('./controllers/users')
app.get('/profile', auth, userController.get)
app.post('/profile', auth, userController.update)
app.get('/users', auth, userController.getAll)
app.post('/users', auth, userController.addNew)

app.get('/logout', auth, require('./controllers/userLogout'))

const searchController = require('./controllers/search')
app.get('/tag/:tag', searchController.tag)
app.get('/search/:query', searchController.general)

app.get('/settings', (req, res) => res.render('settings', { auth: req.session.renderer, production: process.env.PRODUCTION ?? false }))

// No route found, most likely 404
// Must be after all valid routes ^
app.get('*', (req, res) =>
{
	res.status(404)

	if(req.accepts('html'))
		res.render('notFound', { auth: req.session.renderer, production: process.env.PRODUCTION ?? false })
	else if(req.accepts('json'))
		res.json({ error: 'Not found' })
	else // Default to text
		res.type('txt').send('Not found')
})

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