// This component will display a single task, and it's
// information/metadata for use in some other view

import React from 'react' //every component we write will import React from 'react'
import { Task } from '../../types/Task' //using a named import, since task did not use export default

// Props are just arguments that our Functional Components can take in, like any other
// JS or TS function. We use them to pass information from Parent to Child component

// Because Typescript NEEDS things to be typed, we have to define the shape
// of our props. Typically, props are bespoke to the component that takes them in - 
// so they're commonly defined in line in the same file
interface TaskCardProps {
    task: Task;
}


function TaskCard() {

  return (
    <div>TaskCard</div>
  )
}

export default TaskCard