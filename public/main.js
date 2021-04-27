
/* main.js */

import { file2DataURI } from './util.js'

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
    const elements = document.forms.parcel.elements
	console.log(elements)
	document.querySelector('form').addEventListener('input', event => {
		console.log('INPUT CHANGED!')
		console.log(event.target)
		console.log(event.target.value)
		elements.amount_val.value = elements.amount.value
	})
})
