// This component will fetch recent activity from a public API
// when it mounts (when it first renders)

import { useState, useEffect } from "react";

// Typescript interface representing the expected return object from the API
interface ActivityItem {
    id: number;
    title: string;
    completed: boolean
}


function TaskActivityFeed() {
  
    // First, we'll set up some state for our component
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    //Now we can write our useEffect logic - this time with an empty dependency array
    //If we give it an empty array, it will only run once when the component mount
    //If we forget the dependency array, we'll enter an infinite loop of whatever
    //is in useEffect

    useEffect(() => {

        // This effect will require cleanup - so we need to track
        // whether cleanup has been performed
        let cancelled = false;

        //Use effect itself cannot take in an async function as an argument 
        async function fetchActivities(): Promise<void> {
            
            try{
                //First, send our Fetch GET request, limit results to 5
                const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
                
                // Then we check for HTTP errors
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                // Parse the JSON with out TS interface
                const data: ActivityItem[] = await response.json();

                // If our component is still mounted, we want to update the state
                if (!cancelled) {
                    setActivities(data);
                    setLoading(false);
                }

            } catch (err: unknown) {
                // We only want to update this component's state if its still mounted
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message: "Failed to fetch activities."
                    );
                    setLoading(false);
                }
            }
        }

        // Actually calling the async function we wrote above
        fetchActivities();

        // Cleanup function: mark as cancelled so any pending fetch results are ignored
        return () => {
            cancelled = true;
        };

    }, []) //dont forget that empty dependency array second arg
  
    return (
    <div>TaskActivityFeed</div>
  )
}

export default TaskActivityFeed