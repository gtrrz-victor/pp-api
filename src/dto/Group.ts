import { Match } from "./Match"
import { Participant } from "./Participant"

export type Group = {
    id?:string
    matchs: Match[]
    participants: Participant[]
}