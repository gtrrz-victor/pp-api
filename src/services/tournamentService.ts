import AWS from "aws-sdk";
import dotenv from "dotenv";
import { Tournament } from "../dto/Tournament";
import { MatchResult } from "../dto/MatchResult";
dotenv.config();

const client = new AWS.DynamoDB.DocumentClient({
    region: process.env.DYDB_REGION
});
const tableName = 'Tournament';


export default {
    readTournament: () => {
        return readTournamentPromisify()
    },
    addResultMatch: async (groupId:string,matchId:string,result:MatchResult) => {

        const tournament = await readTournamentPromisify()
        const group = tournament.groups.find(({id})=>id===groupId)
        if (group === undefined) throw new Error(`Group id ${groupId} not found in tournament`)
        const match= group.matchs.find(({id})=>id===matchId)
        if (match === undefined) throw new Error(`Match id ${matchId} not found in group ${groupId}`)
        if (match.winner !== undefined) throw new Error(`This match id ${matchId} has already a winner "${match.winner}"`)
        if (match.playerA !== result.winner && match.playerB !== result.winner) throw new Error(`Winner id ${result.winner} is not a participant of the match ${matchId}`)
        const winner = group.participants.find(({id})=>id===result.winner)
        if (winner === undefined) throw new Error(`Winner id ${result.winner} is not a participant of this group ${groupId}`)
        const looserId = (match.playerA === winner.id)?match.playerB:match.playerA
        const looser = group.participants.find(({id})=>id===looserId)
        if (looser === undefined) throw new Error(`Looser id ${looserId} is not a participant of this group ${groupId}`)
        console.log(JSON.stringify(tournament))

        console.log("uhmmm")
        match.winner = result.winner
        match.result = result.result
        winner.matches.wins = winner.matches.wins + 1
        winner.sets.wins = winner.sets.wins + Math.max(...match.result)
        winner.sets.losts = winner.sets.losts + Math.min(...match.result)
        looser.matches.losts = winner.matches.losts + 1
        looser.sets.wins = looser.sets.wins + Math.min(...match.result)
        looser.sets.losts = looser.sets.losts + Math.max(...match.result)
        console.log(JSON.stringify(tournament))
        const params = {
            TableName: tableName,
            Item: tournament
        };
        return new Promise<void>((resolve,reject)=>{
            client.put(params, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });
        })
    }
}


function readTournamentPromisify():Promise<Tournament> {
    return new Promise((resolve, reject) => {
        client.scan({
            TableName: tableName
        }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                const [tournament] = data.Items
                resolve({ groups: tournament.groups, participants:tournament.participants, id: tournament.id})
            }
        });
    })
}