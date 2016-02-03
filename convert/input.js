import 'babel-polyfill'

import fs from 'fs'
import Baby from 'babyparse'
import moment from 'moment'


const input_filename = 'Sentiment.csv', output_filename = 'sentiment.json'

fs.readFile( input_filename, ( err, data ) => {
	if ( err ) {
		throw err
	}

	let json = Baby.parse( data.toString(), { header: true } )

	json.data.forEach(( d ) => {
		let m = moment( d.tweet_created )

		d.tweet_created = m.format()
		d.id_time = m.valueOf() + d.id / 100
	})

	fs.writeFile( output_filename, JSON.stringify( json ) )
})
