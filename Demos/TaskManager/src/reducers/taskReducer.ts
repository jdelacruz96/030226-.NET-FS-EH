//A reducer is NOT a component. Notice we're inside a .TS for this one.
// A reducer is a pure function, it producers a new state based on:
    // What action is called? Remember TaskAction.ts?
    // The current values in state
//We can think of it almost like a switch statement for state changes
//With rigidly defined cases for each possible change of state
// hint: we're gonna use a switch statement here

import type { Task } from "../types/Task";
import type { TaskAction } from "../types/TaskAction";

//Define our reducer function
export function taskReducer(state: Task[], action: TaskAction): Task[] {

    //To handle our different action types, we can use a switch
    switch (action.type) {

        case "CHANGE_STATUS":
            //When we change the status of a task, we map over the array. If the task ID
            //matches, we create a copy of the task with the new status. Otherwise, we just
            //copy the task as is. All of those get bundled into a new Task List, and 
            //that new list replaces what's in state
            return state.map((task) =>
                task.id === action.payload.id ? {...task, status: action.payload.status}
                : task
            )
        
        // TODO: Adding a task, and deleteing a task

        default: { 
            //If we forget (somehow) to handle a possible action type
            //we manually throw an error
            throw new Error("Unhandled action}")
        }
    }
}