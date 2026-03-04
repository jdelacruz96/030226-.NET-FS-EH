//This will now become my landing page.
//All it will do for now, is inform the user of how many tasks 
//there are in total, another page will actually render the TaskCards
//and let them do the updating of the status

import React from 'react'
import type { Task } from '../../types/Task'

//Just like yesterday, because this is TS, we need to define an interface
//for our props
interface DashboardProps {
    //This component takes in the array of task objects held in App.tsx's state
    tasks: Task[]
}

//Just like yesterday, we need to set up our component to take in props
function Dashboard({ tasks }: DashboardProps) {
  return (
    <section className='dashboard'>
        <h2>Dashboard</h2>
        {/* All we want to do is tell the user, there are x tasks right now */}
        <p>There are {tasks.length} tasks on the board</p>
    </section>
  )
}

export default Dashboard