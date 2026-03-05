// This component will allow us to add a task to our Task list. 
// It will also use axios to "POST" our task to the jsonplaceholder API
// In order to do this, we will use a React Form - which is just an HTML form 
// inside of React (with some specific react weirdness we have to account for)
import { useState, FormEvent, ChangeEvent } from "react"
import type { Task } from "../../types/Task"
import { useTaskContext } from "../../contexts/TaskContext"
import axios from "axios"

//This is going to be a Controlled Component - it's values come from and update React State
//State becomes the source of truth for what our form holds, not the actual DOM
//We can add validation so that we can check user inputs before evert firing off the HTTP request
//and we can use things like isSubmitting to prevent double-submission by the user 

// First, lets set up our component's states

//First a state object to hold the Form's values (that the user inputs)
interface FormState {
    title: string;
    description: string;
    assignee: string;
    priority: Task["priority"]
}

// Next, a state object to hold any errors we get from our form
interface FormErrorsState {
    title?: string;
    description?: string;
    assignee?: string;
}

// Finally, before we start writing the meat of our AddTaskForm component, we set 
// an initial state value for FormState.
const initialFormState: FormState = {
    title: "",
    description: "",
    assignee: "",
    priority: "medium"
}

//Now our component
function AddTaskForm() {
    
    // First, lets bring in our Context (task list stored in TaskContext)
    const { tasks, dispatch } = useTaskContext();

    // Next, we set up our Form States via useState()
    const [ formData, setFormData] = useState<FormState>(initialFormState);

    // This holds validation errors, no assignee, description not long enough, etc
    const [ formErrors, setFormErrors ] = useState<FormErrorsState>({}); 
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false); 

    // This holds errors that we get during form submission - 500 responses etc.
    const [ submitError, setSubmitError ] = useState<string | null>(null);


    // Lets set up some input handlers to handle the HTML input elements of our form
    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement
        | HTMLSelectElement> ): void {
        
        const { name, value } = event.target; 
        // As the user types/clicks, the HTML form elements will fire off events
        // and we will update state accordingly 
        setFormData((prev) => ({...prev, [name]: value}))
    }

    // Lets set up some validation logic - so rules we decide about what users can enter
    // in our form. These rules could be based on business needs, what the backend expects, 
    // etc.

    function validate(): FormErrorsState {

        const newErrors: FormErrorsState = {};

        if(!formData.title.trim()) {
            newErrors.title = 'Title is required'
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be 100 chars or less!'
        }

        if(!formData.description.trim()) {
            newErrors.description = 'Description is required!'
        }

        if (!formData.assignee.trim()) {
            newErrors.description = 'Assignee is required!'
        }

        return newErrors;
    }

    // Handling the form submit event
    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        // Part of what changed that led to the deprecation of FormEvent in the newest
        // release of React was not having to explicitly play with default form element behaviors
        // Since we're doing this the "old fashioned way" we still need to prevent default
        event.preventDefault(); // stops the form from triggering a page reload
        setSubmitError(null);

        const validationErrors = validate();

        if(Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        // Using our submission flag
        setIsSubmitting(true);

        // We can use axios to send that HTTP POST request to the placeholder api
        try {

            //POST to the jsonplaceholder mock API
            const response = await axios.post(
                "https://jsonplaceholder.typicode.com/todos",
                {
                    title: formData.title,
                    body: formData.description,
                    userId: 1
                }
            )

            // We probably want to actually add the task to our list of Tasks in context
            const newTask: Task = {
                // We need to find the largest ID in our current list - and create an ID
                // that's one larger than that
                id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
                title: response.data.title,
                description: formData.description,
                assignee: formData.assignee,
                status: "todo",
                priority: formData.priority
            }

            //Here, I would call dispatch for the reducer to update task context
            dispatch({type: "ADD_TASK", payload: newTask})
            // Reset form
            setFormData(initialFormState);

        } catch (error: unknown) {
            setSubmitError("Submission failed, please try again.")
        } finally {
            setIsSubmitting(false)
        }

    }

  return (
    <div>AddTaskForm</div>
  )
}

export default AddTaskForm