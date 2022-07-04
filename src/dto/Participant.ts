export type Participant = {
    id?:string
    name:string
    contact:string
    group:string
    matches:{
        wins:number
        losts:number
    }
    sets:{
        wins:number
        losts:number
    }
}