// We want App.tsx to focus on router stuff
// This component will take over the rendering of TaskCard child components
// And act as its own distinct page/view

//What is STAYING inside App.tsx
//  The hardcoded list of tasks
//  The state with the task list inside it
//  The handleStatusChange() function

//What does this component get?
//  The rendering logic in the return with the map for TaskCards
//      with lists + keys
//  It will need to take in the overall list of tasks from state as a prop
//      to then pass individual tasks to TaskCard children as they're rendered

import React from 'react'
import type { Task } from '../../types/Task'
import TaskCard from '../../components/TaskCard/TaskCard'
import { useTaskContext } from '../../contexts/TaskContext'

interface TaskListProps{
    tasks: Task[] // Task objects to render, coming from App.tsx's state
    //We also have to take in that callback functions, even though all we do 
    //is pass it to the TaskCard child components. This is NOT IDEAL.
    //This is a problem, that while not breaking, is bad enough that React came up 
    //with a solution.
    //This is Prop Drilling (bad)
    onStatusChange: (id: number, newStatus:Task["status"]) => void;
}

function TaskList() {

    //Call the custom hook - this time we ask for task and the dispatch function
    //Since TaskList will update the value inside of the TaskContext
    const { tasks, dispatch } = useTaskContext();

    //We still need to pass a callback function to our TaskCard components 
    //that we render below. This function will work differently from the function
    //we used to update State (via useState and its setter) yesterday

    function handleStatusChange(
        id: number, 
        newStatus: "todo" | "in-progress" | "done"
    ) : void {
        //Here, this function calls the reducer dispatch - and calls 
        //a "CHANGE_STATUS" action
        dispatch({ type: "CHANGE_STATUS", payload: {id, status: newStatus} })
    }


    return (
        <section className='task-list-page'>
            
            <h2>All Tasks</h2>

        {/* Rendering my TaskCards here, rather than in App.tsx
            Notice I passed the prop straight through. */}

        {/* Remember, we want to render/generate a TaskCard component
        for every task in our list (that's in State) */}
        
        {/* Whenever we're using this pattern, for list of x objects
        generate a corresponding number of components, we need to use a Key.
        A key is a like any other prop, except we don't pass it to the child. 
        React uses it behind the scenes, to track which child component is being 
        updated*/}
            <div className='task-list'>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                    />
                ))
                }
            </div>

        </section>
    )
}

export default TaskList