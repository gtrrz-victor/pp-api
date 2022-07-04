import { Group } from "./Group"
import { Participant } from "./Participant"

export type Tournament = {
    groups:Group[],
    participants:Participant[],
    id: string
}