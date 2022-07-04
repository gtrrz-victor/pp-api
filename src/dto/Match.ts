import { Result } from "./Result";

export type Match = {
    id?:string
    playerA: string,
    playerB: string,
    winner?: string,
    result?: Result,
}

