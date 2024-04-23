import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config({path: './config.env'});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).promise();


// const test = await pool.query(`Select * From students`);
// console.log(test)