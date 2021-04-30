
/* routes.js */

import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'
import { upload } from 'https://cdn.deno.land/oak_upload_middleware/versions/v2/raw/mod.ts'
// import { parse } from 'https://deno.land/std/flags/mod.ts'

import { login, register,parcelcollector,couriercollector,couriersearcher } from './modules/accounts.js'
import { addparcel } from './modules/parcels.js'

const handle = new Handlebars({ defaultLayout: '' })

const router = new Router()

// the routes defined here
router.get('/', async context => {
    
	const authorised = context.cookies.get('authorised')
    console.log(authorised)
	if(authorised === undefined) context.response.redirect('/login')
    context.response.redirect('/home')
})

router.get('/home', async context => {
	const authorised = context.cookies.get('authorised')
    const couriercookie = context.cookies.get('iscour')
    console.log(couriercookie)
	if(authorised === undefined) context.response.redirect('/login')
    if(couriercookie === 'yes') context.response.redirect('/courhome')
	const data = { authorised }
    try{
        const parceldata = await parcelcollector(data)
        const body = await handle.renderView('home', parceldata)
        context.response.body = body      
    } catch(err){
        console.log(err)
		context.response.redirect('/login')   
    }
	
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
  context.cookies.delete('iscour')
  context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST /login')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	try {
		const username = await login(obj)
		context.cookies.set('authorised', username.username)
        context.cookies.set('iscour', username.courier)
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

router.get('/courhome', async context => {
	const authorised = context.cookies.get('authorised')
    const couriercookie = context.cookies.get('iscour')
	if(authorised === undefined) context.response.redirect('/login')
    if(couriercookie === 'no') context.response.redirect('/home')
	const data = { authorised }
    
    const parceldata = await couriercollector(data) 
    const body = await handle.renderView('courhome', parceldata)
    context.response.body = body
	
})
router.post('/courhome', async context => {
	console.log('POST /courhome')
	const body = context.request.body({ type: 'form-data' })
	const data = await body.value.read()
	data.username = context.cookies.get('authorised')
    
    try{
        
      await couriersearcher(data)
        
    }
    catch(err){
        console.log(err)
		context.response.redirect('/courhome') 
    }
    
	
	context.response.redirect('/')
})



export default router
