import { useState } from 'react' //useState is a React hook for managing state
import TaskCard from './components/TaskCard/TaskCard'
import type { Task } from './types/Task'; //import type because Task is a type
import './App.css'

// State for our TaskCard will live here - for now - we might refactor away
// from this when we get to things like Context and useReducer later this week
// If we were using an API to get task info - we'd send the HTTP requests from this component
// and pass the data to TaskCard as props. For now we'll hardcode things. 

//First, kind of boring, lets hardcode some task objects - as an array
const initialTasks: Task[] = [
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


function App() {
  //In order to store anything as State, we need to use useState (for now)
  //state is an object, that contains two things - The State, and a Setter
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  
  //Now that we have our state, and we've set it's inital value, we need to do 2 things:
  // 1. Make sure we pass the state as a prop to our Child (TaskCard)
  // 2. Create a callback function that will also be passed as a prop, 
  //    so the child can send state back up to the parent
  function handleStatusChange(id: number, newStatus: Task['status']): void {
    // We want to iterate over our array, and create new objects that reflect
    // the updated status when this function is called
    setTasks((prev) => //prev refers to the exisitng (whatever is in state right now) value of state
      
      //Because TS is just JS with some extra stuff - we can do some pretty load bearing
      // one-liners. When you do this, PLEASE add comments.
      //setTasks takes a callback that receives the previous state (prev)
      // .map() iterates over every task in the array 
      // {...t, status: newStatus} uses the JS SPREAD OPERATOR to copy all properties
      // of the matching task (so if I click the button to change the status of task 2, only
      // it's info gets updated, and only the status gets overridden)
      // This creates a new object instead of directly mutating the existing one
      // Because react relies on that behavior (no direct mutation) to detect change and re-render
      prev.map((t) => (t.id === id ? {...t, status: newStatus} : t))
    )
  }

  return (
    <main className='app-container'>
      <h1>Task Manger</h1>
      <p>A Task Manager front end built with React + TS</p>
      
      {/* Remember, we want to render/generate a TaskCard component
        for every task in our list (that's in State) */}
      {/* Whenever we're using this pattern, for list of x objects
      generate a corresponding number of components, we need to use a Key.
      A key is a like any other prop, except we don't pass it to the child. 
      React uses it behind the scenes, to track which child component is being 
      updated*/}
      <section>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
          />
        ))
        }
      </section>


    </main>
  )
}

export default App
