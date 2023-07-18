const searchInput  = document.getElementById('search').getElementsByTagName('input')[0]
const searchButton = document.getElementById('search').getElementsByTagName('button')[0]

// When a key is pressed in the search input, resets this using setInterval.
// If fired, redirects to /search/:query
let searchInterval = null
const SearchInputDelay = 750 // milliseconds

ToggleSearchBar = (focus = true) =>
{
	searchInput.classList.toggle('active')
	let active = searchInput.classList.contains('active')
	
	searchButton.innerHTML = `<i class="fa-solid fa-${active ? 'circle-xmark' : 'magnifying-glass'}"></i>`

	if(!active && searchInterval != null)
	{
		clearInterval(searchInterval)
		searchInterval = null
	}

	if(!active)
		searchInput.value = ''
	else if(focus)
		searchInput.focus()
}

DoSearch = () =>
{
	// Check that search query is long enough
	if(searchInput.value.length >= 3)
		location.href = `/search/${searchInput.value}`
}

ResetSearchInterval = (event) =>
{
	if(event.key == 'Enter')
	{
		DoSearch()
		return
	}

	if(searchInterval)
		clearInterval(searchInterval)
	searchInterval = setInterval(DoSearch, SearchInputDelay)
}

searchButton.addEventListener('click', ToggleSearchBar)
searchInput.addEventListener('keydown', ResetSearchInterval)

// If page loaded from a search query, open up the seach bar
if(searchInput.value != '')
	ToggleSearchBar(false)