import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();
app.use(express.json())
app.use(cors())

app.get( "/", ( req, res ) => {
    res.send("first lines of code!!!")
} );

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );