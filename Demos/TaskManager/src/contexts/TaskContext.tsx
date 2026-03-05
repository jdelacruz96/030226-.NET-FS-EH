// This file will hold our context, and export the TaskContext and TaskProvider
// Here we will use the useContext Hook, rather than useState. We will also make
// use of that reducer from this file. 
// Real apps can have multiple contexts - things like auth, theme, specific feature flags,
// etc - but they're all structurally similar to what we're gonna build here

//Importing context and reducer hooks from react
import { createContext, useContext, useReducer } from "react";
//Importing our custom interfaces
import type { Task } from "../types/Task";
import type { TaskAction } from "../types/TaskAction";
//Importing the actual reducer function that we created
import { taskReducer } from "../reducers/taskReducer";


// Just like when using useState, we need to define the shape of the data
// that will held inside of this Context, and passed to any components it serves
interface TaskContextValue {
    // The list of tasks, just like before
    tasks: Task[];
    // It will also hold a function called dispatch, that allows components
    // to send actions top the reducer
    dispatch: React.Dispatch<TaskAction>;
}

// Now that we've defined what Context will/can hold - we need to create the actual
// React Context

// We initialize context with 'undefined' because the real value won't be available
// until the context provider actually renders - and that's not instant 
const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// Optional: but we can use a custom hook to make consuming context easier/safer
// in other components. 
export function useTaskContext(): TaskContextValue {
    //1. Get current context value
    const currentContext = useContext(TaskContext);

    //If the context is undefined, it means that we somehow either called this 
    //really REALLY fast before the provider even rendered (somehow) - OR more likely,
    //we called this from outside a provider, and this can let us know 
    // "hey fix your TSX/HTML tag structure"
    if (!currentContext) {
        throw new Error("useTaskContext must be used within a TaskProvider")
    }

    //Return the context value - Because we checked for context being undefined
    //this can never return undefined
    return currentContext;
}

//Initial seed data for our app 
const seedTasks: Task[] = [
  {
    id: 1,
    title: "Set up GH repo",
    description: "Initialize git repo, add .gitignore for react projects",
    assignee: "Asmita",
    status: "todo",
    priority: "high"
  },
  {
    id: 2,
    title: "Design DB Schema",
    description: "Draft ERD for user, task tables",
    assignee: "Pavel",
    status: "in-progress",
    priority: "medium"
  },
  {
    id: 3,
    title: "Create homepage Figma mockup",
    description: "Sketch simple wireframe for the landing view/page",
    assignee: "Sammar",
    status: "todo",
    priority: "low"
  }
]

//The context Provider will wrap any components that need access to this context/state
//The Provider component expects props - the props it takes in are it's "children"
//So we need an interface (because TS expects us to type our props) to represent
//all of the nested components that this Provider will wrap
interface TaskProviderProps {
    children: React.ReactNode
}

// Now, finally, we can define our context provider component, we will call
// TaskProvider. Its going to wrap our application inside of App.tsx in the same
// way that the BrowserRouter does.

export function TaskProvider({children} : TaskProviderProps) {

    //In here, we will use our reducer. We set up the reducer state 
    // with the useReducer hook. It takes our reducer function, and initial seed data
    // and returns the current state - as well as the dispatch function
    const [tasks, dispatch] = useReducer(taskReducer, seedTasks)

    //In our return down here, we provide all nested children two things:
    //  1. The tasks array in state
    //  2. The dispatch function for that reducer, so they can update state via 
    //      the reducer (so that is ALWAYS valid)
    return (
        <TaskContext.Provider value={{ tasks, dispatch}}>
            {children}
        </TaskContext.Provider>
    )
}