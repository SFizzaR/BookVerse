const oracledb=require('oracledb');
const dotenv=require('dotenv');

dotenv.config();

oracledb.initOracleClient({libDir: 'C:/instantclient_23_4'});


let connection;

async function connectToDatabase()
{
    if(connection)
    {
        return connection;
    }
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
        password: process.env.PASSWORD,
        connectString:
        `${process.env.HOST}:${process.env.DBPORT}/${process.env.SID}`
        });
        console.log("Connected to database:", process.env.DATABASE);
        return connection;
        } catch (err) {
        console.error("Error connecting to database:", err.message);
        console.error("Error details:", err);
        throw err;
        }
}
connectToDatabase();
module.exports = connectToDatabase;