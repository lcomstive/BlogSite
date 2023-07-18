// # of pages shown on either side of the currently selected page
const MaxPagesShown = 2

GetParams = () =>
{
	let url = new URL(location.href)
	return [ url, new URLSearchParams(url.search) ]
}

UpdateLocation = (url, params) => location.href = `${url.origin}${url.pathname}?${params}`

SortBy = (method) =>
{
	let [url, params] = GetParams()
	params.set('sort', method)
	
	UpdateLocation(url, params)
}

UpdateDateRange = () =>
{
	let [url, params] = GetParams()

	let from = document.getElementById('dateFrom').value
	if(from) params.set('min', from)
	else params.delete('min')

	let to = document.getElementById('dateTo').value
	if(to) params.set('max', to)
	else params.delete('max')
	
	UpdateLocation(url, params)
}

SetPage = (page) =>
{
	let [url, params] = GetParams()
	params.set('page', page)
	UpdateLocation(url, params)
}

window.addEventListener('load', () =>
{
	const pagesElement = document.getElementById('pages')

	if(!pagesElement)
		return // Not enough elements to display more than one page

	if(currentPage == 1)
		pagesElement.children[0].disabled = true
	if(currentPage == totalPages)
		pagesElement.children[pagesElement.childElementCount - 1].disabled = true

	let pageStart = Math.max(1, Math.floor(currentPage - MaxPagesShown))
	let pageEnd = Math.min(totalPages, Math.floor(currentPage + MaxPagesShown))

	for(let i = pageStart; i <= pageEnd; i++)
	{
		let element = document.createElement('button')
		element.innerHTML = String(i)
		if(i == currentPage)
			element.disabled = true

		element.onclick = () => SetPage(i)
		
		pagesElement.insertBefore(element, pagesElement.lastElementChild)
	}
})