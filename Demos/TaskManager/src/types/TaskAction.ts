import type { Task } from "./Task";

// We are going to use a Typescript "Discriminated union" type to hold
// all possible reducer actions. Defining them here means they're centralized for easy
// reference, and we can come back and add more possible actions as our app and reducer 
// grow in scope

export type TaskAction = 
    //Action to change the status of an existing task. Payload requires the task id
    //and the new status
    //Each Action for our reducer MUST have a 'type' that is a string literal,
    //as well as an option payload that contains data
    | {type: "CHANGE_STATUS"; payload: {id: number; status: Task["status"]}}
    //Action to add a brand new task. Payload is just an entire task object
    | {type: "ADD_TASK"; payload: Task}
    //Action to delete a task eventually, payload just needs the task to delete
    | {type: "DELETE_TASK"; payload: {id: number}}
