import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import cors from "cors";
import { MatchResult } from "./dto/MatchResult";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();
app.use(express.json())
app.use(cors())

app.get( "/pptournament/groups", ( _, res: Response ) => {
    res.send([])
});

app.patch("/pptournament/groups/:groupId/matchs/:matchId",(req: Request, res: Response)=>{
    const match:MatchResult = req.body
    console.log("adding new result")
    console.log(match)
    res.send()
})

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

// testing-purpose