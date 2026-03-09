// This component will display a single task, and it's
// information/metadata for use in some other view

// import React from 'react' //every component we write will import React from 'react'
import type { Task } from '../../types/Task'; //using a named import, since task did not use export default
 //using a named import, since task did not use export default

// Props are just arguments that our Functional Components can take in, like any other
// JS or TS function. We use them to pass information from Parent to Child component

// Because Typescript NEEDS things to be typed, we have to define the shape
// of our props. Typically, props are bespoke to the component that takes them in - 
// so they're commonly defined in line in the same file
interface TaskCardProps {
    task: Task;
    //Later, I will pass a function from App.tsx to this child component
    //so that information can flow back up from child -> parent - a callback function
    onStatusChange: (id: number, newStatus:Task["status"]) => void;
}


function TaskCard( {task, onStatusChange}: TaskCardProps ) {

  //I want this taskcard to contain a button that displays the current 
  //status of the task.  When clicked, I want to cycle through the statuses 
  //in a specific logical order.
  // todo -> in-progress -> done -> todo
  // void letting the typescript compiler know that nothing gets returned
  // from handleClick - same as function return typing in C#
  function handleClick(): void {

    //We could resolve our functionality in many different ways, thats the joy
    //of programming. We could probably use a switch or if-elseif-else, etc
    //We are going to use, for the sake of demo, RECORD - Typescript UTILITY TYPE
    
    //Record<KeyType, ValueType> - Typescript Utlity type
    //It creates an object wjhere:
    //  every key has to correspond to a list of set keys
    //  every value must also correspond to a predetermined set value
    //  We are manually enforcing what can map to what, as key-value pairs
    const statusCycle: Record<Task["status"], Task["status"]> = {
      //Then we manually map keys to values
      "todo": "in-progress",
      "in-progress": "done",
      "done": "todo"
    }

    //Here, we will actually call upon that function that will come in as a prop from App.tsx
    //so that we can pass the next status from Child -> Parent 
    onStatusChange(task.id, statusCycle[task.status])
  }

  //Inside my return, I create the HTML skeleton for my component view. What does the
  //user actually see. I can use {} to break out of HTML and into TSX so I can call upon
  //data from my component, or even call functions from wihin my TSX return.
  return (
    <div className={`task-card priority-${task.priority}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className='task-meta'>
        <span className='assignee'>Assigned to: {task.assignee}</span>
        
        {/*This is a comment inside my tsx return area*/}
        <button 
          className={`status-badge status-${task.status}`}
          onClick={handleClick}
          type="button"
          >
            {task.status}
        </button>

      </div>


    </div>
  )
}

export default TaskCard