"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new aws_sdk_1.default.DynamoDB.DocumentClient({
    region: process.env.DYDB_REGION
});
const tableName = 'Tournament';
exports.default = {
    readTournament: () => {
        return readTournamentPromisify();
    },
    addResultMatch: (groupId, matchId, result) => __awaiter(void 0, void 0, void 0, function* () {
        const tournament = yield readTournamentPromisify();
        const group = tournament.groups.find(({ id }) => id === groupId);
        if (group === undefined)
            throw new Error(`Group id ${groupId} not found in tournament`);
        const match = group.matchs.find(({ id }) => id === matchId);
        if (match === undefined)
            throw new Error(`Match id ${matchId} not found in group ${groupId}`);
        if (match.winner !== undefined)
            throw new Error(`This match id ${matchId} has already a winner "${match.winner}"`);
        if (match.playerA !== result.winner && match.playerB !== result.winner)
            throw new Error(`Winner id ${result.winner} is not a participant of the match ${matchId}`);
        const winner = group.participants.find(({ id }) => id === result.winner);
        if (winner === undefined)
            throw new Error(`Winner id ${result.winner} is not a participant of this group ${groupId}`);
        const looserId = (match.playerA === winner.id) ? match.playerB : match.playerA;
        const looser = group.participants.find(({ id }) => id === looserId);
        if (looser === undefined)
            throw new Error(`Looser id ${looserId} is not a participant of this group ${groupId}`);
        console.log(JSON.stringify(tournament));
        console.log("uhmmm");
        match.winner = result.winner;
        match.result = result.result;
        winner.matches.wins = winner.matches.wins + 1;
        winner.sets.wins = winner.sets.wins + Math.max(...match.result);
        winner.sets.losts = winner.sets.losts + Math.min(...match.result);
        looser.matches.losts = winner.matches.losts + 1;
        looser.sets.wins = looser.sets.wins + Math.min(...match.result);
        looser.sets.losts = looser.sets.losts + Math.max(...match.result);
        console.log(JSON.stringify(tournament));
        const params = {
            TableName: tableName,
            Item: tournament
        };
        return new Promise((resolve, reject) => {
            client.put(params, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    })
};
function readTournamentPromisify() {
    return new Promise((resolve, reject) => {
        client.scan({
            TableName: tableName
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                const [tournament] = data.Items;
                resolve({ groups: tournament.groups, participants: tournament.participants, id: tournament.id });
            }
        });
    });
}
//# sourceMappingURL=tournamentService.js.map