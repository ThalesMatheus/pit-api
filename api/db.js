import mysql from 'mysql'

export const db = mysql.createConnection({
  host: '192.168.51.172',
  user: 'root',
  password: 'my-secret-pw',
  database: 'HobbyIt'
})
