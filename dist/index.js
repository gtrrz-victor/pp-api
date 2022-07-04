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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tournamentService_1 = __importDefault(require("./services/tournamentService"));
dotenv_1.default.config();
const port = process.env.SERVER_PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/pptournament/groups", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groups } = yield tournamentService_1.default.readTournament();
        res.type('application/json');
        res.send({ groups });
    }
    catch (error) {
        res.status(500);
        res.send(error);
    }
}));
app.patch("/pptournament/groups/:groupId/matchs/:matchId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const matchResult = req.body;
    if (matchResult.result.length !== 2) {
        res.status(400);
        res.send("result should be an array of 2 numbers");
        return;
    }
    if (matchResult.result.reduce((a, b) => a + b, 0) > 3) {
        res.status(400);
        res.send("result should not exceed 3 played sets as total");
        return;
    }
    try {
        yield tournamentService_1.default.addResultMatch(req.params.groupId, req.params.matchId, matchResult);
        res.end();
    }
    catch (error) {
        console.log(error);
        res.status(400);
        res.send(`Error: ${error}`);
    }
}));
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map