import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import cors from "cors";
import { MatchResult } from "./dto/MatchResult";
import tournamentService from "./services/tournamentService"
dotenv.config();
const port = process.env.SERVER_PORT;
const app = express();
app.use(express.json())
app.use(cors())

app.get("/health", (_, res: Response) => {
    res.send()
})

app.get("/pptournament/groups", async (_, res: Response) => {
    try {
        const { groups } = await tournamentService.readTournament()
        res.type('application/json')
        res.send({ groups });
    } catch (error) {
        res.status(500)
        res.send(error)
    }
});

app.patch("/pptournament/groups/:groupId/matchs/:matchId", async (req: Request, res: Response) => {
    const matchResult: MatchResult = req.body
    if (matchResult.result.length !== 2) {
        res.status(400)
        res.send("result should be an array of 2 numbers")
        return
    }
    if (matchResult.result.reduce((a, b) => a + b, 0) > 3) {
        res.status(400)
        res.send("result should not exceed 3 played sets as total")
        return
    }
    try {
        await tournamentService.addResultMatch(req.params.groupId, req.params.matchId, matchResult)
        res.end();
    } catch (error: any) {
        console.log(error)
        res.status(400)
        res.send(`Error: ${error}`)
    }
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});