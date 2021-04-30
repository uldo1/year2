
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
    sql = `SELECT iscourier FROM accounts WHERE user = "${data.username}";`
	records = await db.query(sql)
    const courier = {
        accounts:records
    }
    data.courier = courier.accounts[0].iscourier
    
	return data
}

export async function register(data) {
	const password = await hash(data.password, salt)
	const sql = `INSERT INTO accounts(user, pass, iscourier) VALUES("${data.username}", "${password}", "${data.courier}")`
	
	const records = await db.query(sql)
	return true
}

export async function parcelcollector(Uname){
    let sql = `SELECT Rec_name, D_postcode, date_added, Status FROM Parcels WHERE sender_username = "${Uname.authorised}";` 
    let result = await db.query(sql)
    const data = {
        Parcels:result
    }
    
    return data
    
}

export async function couriersearcher(things){
    
    let sql = `SELECT count(Tracking_id)AS count FROM Parcels WHERE Tracking_id = "${things.fields.parcel_id}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`Parcel id "${things.fields.parcel_id}" not found`)
    sql = `UPDATE Parcels SET status = 'in transit', delivery_username = "${things.username}" WHERE Tracking_id = "${things.fields.parcel_id}"`
	console.log(sql)
    records = await db.query(sql)
    return 1
    
}
export async function couriercollector(Uname){
    let sql = `SELECT Rec_name, D_postcode, weight, date_added FROM Parcels WHERE delivery_username = "${Uname.authorised}";` 
    let result = await db.query(sql)
    const data = {
        Parcels:result
    }
    console.log(data)
    data.Parcels.forEach((element, index, array) => {
    console.log(element.date_added);
    let start = new Date(element.date_added).getTime();
    let now = new Date().toISOString()
    let end = new Date(now).getTime();    
    let milliseconds = Math.abs(end - start).toString();
    let seconds = parseInt(milliseconds / 1000);
    let minutes = parseInt(seconds / 60);
    let hours = parseInt(minutes / 60);
    
    data.Parcels[index].hours = hours
});
    console.log(data)
    return data
    
}
