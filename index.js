import 'babel-polyfill'

import d3 from 'd3'

let render_candidates = ( data ) => {
	const margin = { top: 20, right: 20, bottom: 20, left: 200 },
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom

	let data_keys = d3.keys( data ).sort(( a, b ) => { return data[b] - data[a] })

	let x = d3.scale.linear()
		.domain([ 0, d3.max( d3.values( data ) ) ])
		.range([ 0, width * 0.9 ])

	let y = d3.scale.ordinal()
		.domain( data_keys )
		.rangeRoundBands([ 0, height ])

	let yAxis = d3.svg.axis()
		.scale( y )
		.orient( 'left' )

	let svg = d3.select( '#candidates' ).append( 'svg' )
		.attr( 'height', height + margin.top + margin.bottom )
		.attr( 'width', width + margin.left + margin.right )

	let chart = svg.append( 'g' )
		.attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' )

	chart.append( 'g' )
		.call( yAxis )

	chart.selectAll( '.bar' )
		.data( data_keys )
		.enter().append( 'rect' )
		.attr( 'class', 'bar' )
		.attr( 'width', ( d ) => { return x( data[d] ) } )
		.attr( 'y', ( d ) => { return y(d) + 5 } )
		.attr( 'height', 16 )
		.attr( 'fill', d3.scale.category20b() )
}

let render_bogus_candidates = ( data ) => {
	let content = []

	data.forEach(( d ) => {
		if ( d.candidate === '' ) {
			content.push( d.text )
		}
	})

	d3.select( '#bogus_candidates' ).append( 'ul' )
		.selectAll( 'li' )
		.data( content )
		.enter()
		.append( 'li' )
		.text(( d ) => { return d })
}

let render_candidates_circular = ( data ) => {
	const margin = { top: 20, right: 20, bottom: 20, left: 20 },
		radius = 200, padding_right = 300

	let candidates = []
	d3.keys( data ).forEach(( k ) => {
		candidates.push({ 'name': k, 'count': data[k] })
	})

	let svg = d3.select( '#candidates_circular' ).append( 'svg' )
		.attr( 'height', radius * 2 + margin.top + margin.bottom )
		.attr( 'width', radius * 2 + margin.left + margin.right + padding_right )

	let pie = d3.layout.pie()
		.value(( d ) => { return d.count })

	let arc = d3.svg.arc()
		.innerRadius( radius / 2 )
		.outerRadius( radius )

	let colour = d3.scale.category20b()

	let chart = svg.append( 'g' )
		.attr( 'transform', 'translate(' + ( margin.left + radius ) + ',' + ( margin.top + radius ) + ')' )

	chart.selectAll( 'path' )
		.data( pie( candidates ) )
		.enter().append( 'path' )
		.attr( 'd', arc )
		.attr( 'fill', ( d, i ) => { return colour( i ) } )

	const legendSize = 18, legendSpacing = 4

	let legend = chart.selectAll( '.legend' )
		.data( candidates )
		.enter().append( 'g' )
		.attr( 'class', 'legend' )
		.attr( 'transform', ( d, i ) => {
			let height = legendSize + legendSpacing
			let offset = height * colour.domain().length / 2
			let hor = -2 * legendSize + padding_right
			let ver = i * height - offset
			return 'translate(' + hor + ',' + ver + ')'
		} )

	legend.append( 'rect' )
		.attr( 'width', legendSize )
		.attr( 'height', legendSize )
		.style( 'fill', ( d, i ) => { return colour( i ) } )
		.style( 'stroke', ( d, i ) => { return colour( i ) } )

	legend.append( 'text' )
		.attr( 'x', legendSize + legendSpacing )
		.attr( 'y', legendSize - legendSpacing )
		.text( ( d ) => { console.log( d ); return d.name } )
}

d3.json( 'convert/sentiment.json', ( error, json ) => {
	let data = json.data

	let candidates = {}
	data.forEach(( d ) => {
		candidates[d.candidate] = ( undefined === candidates[d.candidate]) ? 1 : candidates[d.candidate] + 1
	})
	render_candidates( candidates )

	render_bogus_candidates( data )

	let candidates_fixed = {}
	data.forEach(( d ) => {
		d.candidate = ( '' === d.candidate ) ? 'No candidate mentioned' : d.candidate
		candidates_fixed[d.candidate] = ( undefined === candidates_fixed[d.candidate]) ? 1 : candidates_fixed[d.candidate] + 1
	})
	render_candidates_circular( candidates_fixed )
})
