import 'dotenv/config';
import pg from 'pg';

//database client setup
const { Pool } = pg;
const dbPool =  new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10)
})

//check database connection on server statup
dbPool.connect((err, client, release) => {
    if(err){
        console.log("Database connection failed");
        console.log(err);
        return;
    }
    console.log("Database connected successfully");
    release(); //release the client back to the pool after checking
})

export default dbPool;