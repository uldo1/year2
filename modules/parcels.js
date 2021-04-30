
import { db } from  './db.js'

export async function addparcel(data){
    console.log('addparcel')
    data.fields.username = data.username
    await addparceldetails(data.fields)
       
}

export async function addparceldetails(data){
    console.log('addparceldetails')
   
    let sql = ' '
    const now = new Date().toISOString()
    const date = now.slice(0, 19).replace('T', ' ')
    const newstatus = "not-dispatched"
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sql = `INSERT INTO Parcels(S_poscode, D_postcode, Weight, Rec_Name, Full_Address, sender_username, date_added, Status, Tracking_id )\
    VALUES("${data.S_postcode}", "${data.D_postcode}", ${data.amount}, "${data.Name}", "${data.Address}", "${data.username}", "${date}", "${newstatus}", "${uniqueId}")`
    sql = sql.replaceAll('"undefined"', 'NULL')
    
    const result = await db.query(sql)
    console.log(result)
    
}

