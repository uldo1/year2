
/* routes.js */

import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'
import { upload } from 'https://cdn.deno.land/oak_upload_middleware/versions/v2/raw/mod.ts'
// import { parse } from 'https://deno.land/std/flags/mod.ts'

import { login, register } from './modules/accounts.js'
import { addparcel } from './modules/parcels.js'

const handle = new Handlebars({ defaultLayout: '' })

const router = new Router()

// the routes defined here
router.get('/', async context => {
	const authorised = context.cookies.get('authorised')
	if(authorised === undefined) context.response.redirect('/login')
    context.response.redirect('/home')
})

router.get('/home', async context => {
	const authorised = context.cookies.get('authorised')
	if(authorised === undefined) context.response.redirect('/login')
	const data = { authorised }
	const body = await handle.renderView('home', data)
	context.response.body = body
})

router.get('/login', async context => {
	const body = await handle.renderView('login')
	context.response.body = body
})

router.get('/register', async context => {
	const body = await handle.renderView('register')
	context.response.body = body
})

router.post('/register', async context => {
	console.log('POST /register')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	await register(obj)
	context.response.redirect('/login')
})

router.get('/logout', context => {
  // context.cookies.set('authorised', null) // this does the same
  context.cookies.delete('authorised')
  context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST /login')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	try {
		const username = await login(obj)
		context.cookies.set('authorised', username)
		context.response.redirect('/home')
	} catch(err) {
		console.log(err)
		context.response.redirect('/login')
	}
})
router.get('/new', async context => {
    console.log('get/new')
    const authorised = context.cookies.get('authorised')
	if(authorised === undefined) context.response.redirect('/login')
    const body = await handle.renderView('new')
	context.response.body = body
})

router.post('/new', async context => {
	console.log('POST /new')
	const body = context.request.body({ type: 'form-data' })
	const data = await body.value.read()
	data.username = context.cookies.get('authorised')
    await addparcel(data)
	
	context.response.redirect('/')
})



export default router
