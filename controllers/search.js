const MaxPostsPerPage = 9
const Post = require('../database/models/Post')

const GetDateToString = (date) =>
{
	if(date == null) return null
	let day = date.getDate()
	let month = date.getMonth() + 1

	if(day < 10) day = `0${day}`
	if(month < 10) month = `0${month}`

	return `${date.getFullYear()}-${month}-${day}`
}

ShowSearchResults = async (req, res, query) =>
{
	// Limit to date range
	let dateMin = req.query?.min
	let dateMax = req.query?.max

	let dateRangeOptions = {}
	if(dateMin != null) dateRangeOptions.$gte = new Date(dateMin)
	if(dateMax != null)
	{
		dateRangeOptions.$lte = new Date(dateMax)
		// +1 day so we include the date we're looking for
		dateRangeOptions.$lte.setDate(dateRangeOptions.$lte.getDate() + 1)
	}
	if(dateMin != null || dateMax != null)
		query.createdAt = dateRangeOptions

	let posts = Post.find(query)

	// Sort
	let sort = req.query?.sort ?? 'desc'
	posts = posts.sort({ createdAt: sort == 'desc' ? -1 : 1 })

	// Pagination
	let allPosts = await Post.find(query)
	let totalPages = Math.ceil(allPosts.length / MaxPostsPerPage)
	let currentPage = Math.min(Math.max(req.query?.page ?? 1, 1), totalPages)

	if(totalPages > 0)
		posts = posts.limit(MaxPostsPerPage).skip((currentPage - 1) * MaxPostsPerPage)
	
	// Finalise posts data
	posts = await posts

	let renderOptions = {
		sort,
		tag: req.params.tag,
		searchQuery: req.params.query,
		auth: req.session.renderer,
		production: process.env.PRODUCTION ?? false,

		currentPage,
		totalPages
	}

	// Pass date range back to client
	if(posts?.length > 0)
	{
		renderOptions.posts = posts

		if(dateMin == null && allPosts.length > 0)
			dateMin = GetDateToString(allPosts[sort == 'desc' ? allPosts.length - 1 : 0].createdAt)
		if(dateMax == null && allPosts.length > 0)
			dateMax = GetDateToString(allPosts[sort == 'desc' ? 0 : allPosts.length - 1].createdAt)

		renderOptions.dateMin = dateMin
		renderOptions.dateMax = dateMax
	}

	res.render('searchResults', renderOptions)
}

module.exports =
{
	allPosts: (req, res)  => ShowSearchResults(req, res, { isActive: true }),
	allDrafts: (req, res) => ShowSearchResults(req, res, { isActive: false }),

	general: (req, res) => ShowSearchResults(req, res, { $text: { $search: req.params.query }, isActive: true }),

	tag: (req, res) => ShowSearchResults(req, res, { tags: { $regex: new RegExp(req.params.tag, 'i') }, isActive: true })
}