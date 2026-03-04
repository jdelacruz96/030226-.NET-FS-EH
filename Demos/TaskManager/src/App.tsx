import { useState } from 'react' //useState is a React hook for managing state
import type { Task } from './types/Task'; //import type because Task is a type
import NavBar from './components/NavBar/NavBar';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskList from './pages/TaskList/TaskList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

// State for our TaskCard will live here - for now - we might refactor away
// from this when we get to things like Context and useReducer later this week
// If we were using an API to get task info - we'd send the HTTP requests from this component
// and pass the data to TaskCard as props. For now we'll hardcode things. 


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
    //BrowserRouter wraps out application and enables routing
    
    <BrowserRouter>
      {/* The navbar sits outside the <Routes>, it is always rendered and not part of a 
        specific page. Omnipresent */}
      <NavBar />
      <main className='app-container'>
        <Routes>
          {/* The root route, should probably always be defined ('/')
            It is what users will see when they first land on the page */}
            <Route path='/' element={<Dashboard tasks={tasks} />} />

            <Route 
              path='/tasks' 
              element={ <TaskList tasks={tasks} onStatusChange={handleStatusChange} />}
            />
            
        </Routes>
      </main>
    
    </BrowserRouter>
  )
}

export default App
