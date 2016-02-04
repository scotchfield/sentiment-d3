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

d3.json( 'convert/sentiment.json', ( error, json ) => {
	let data = json.data

	let candidates = {}
	data.forEach(( d ) => {
		candidates[d.candidate] = ( undefined === candidates[d.candidate]) ? 1 : candidates[d.candidate] + 1
	})
	render_candidates( candidates )

	render_bogus_candidates( data )
})
