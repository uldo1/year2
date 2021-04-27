
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function login(data) {
	console.log(data)
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${data.username}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${data.username}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${data.username}";`
	records = await db.query(sql)
	const valid = await compare(data.password, records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${data.username}"`)
	return data.username
}

export async function register(data) {
	const password = await hash(data.password, salt)
	const sql = `INSERT INTO accounts(user, pass) VALUES("${data.username}", "${password}")`
	console.log(sql)
	const records = await db.query(sql)
	return true
}
