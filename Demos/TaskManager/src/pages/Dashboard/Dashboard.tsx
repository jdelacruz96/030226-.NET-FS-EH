//This will now become my landing page.
//All it will do for now, is inform the user of how many tasks 
//there are in total, another page will actually render the TaskCards
//and let them do the updating of the status

//import type { Task } from '../../types/Task'
import { useTaskContext } from '../../contexts/TaskContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import TaskActivityFeed from '../../components/TaskActivityFeed/TaskActivityFeed';

//Just like yesterday, because this is TS, we need to define an interface
//for our props
// interface DashboardProps {
//     //This component takes in the array of task objects held in App.tsx's state
//     tasks: Task[]
// }

function Dashboard() {

  //Instead of taking in the task list as props provided as arguments to functional component
  //we will instead "consume" or "ask for" the context value that is stored in TaskContext.tsx
  //To do that, we just use that custom hook we set up earlier.
  const { tasks } = useTaskContext();

  //Sync the document title with the current task count
  //Every time a new task is added the title with change
  useDocumentTitle(`Task Manager - ${tasks.length} tasks`)

  return (
    <section className='dashboard'>
        <h2>Dashboard</h2>
        {/* All we want to do is tell the user, there are x tasks right now */}
        <p>There are {tasks.length} tasks on the board</p>
        <TaskActivityFeed></TaskActivityFeed>
    </section>
  )
}

export default Dashboard