// This component will act as a persistent navigation bar with links
// that is rendered at the top of every page at all times
// Instead of normal HTML <a> links, we will use React Router <link> tags
// If we use <a> links, that triggers an actual browser page refresh - NOT WHAT WE WANT
import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (

    <nav className='navbar'>
        <span className='navbar-brand'>Task Manager</span>
        <div className='navbar-links'>
            {/* Our navbar will use Links instead of <a> tags to prevent
                browser refreshes/reloads. Links have a "to" attriute, that is
                the actual browser URL path that the link leads to */}
            <Link to="/" className='nav-link'> Dashboard </Link>
            <Link to="/tasks" className='nav-link'>Task List</Link>  
            <Link to="/tasks/new" className='nav-link'>New Task</Link>
        </div>
    </nav>

  )
}

export default NavBar