// This component will allow us to add a task to our Task list. 
// It will also use axios to "POST" our task to the jsonplaceholder API
// In order to do this, we will use a React Form - which is just an HTML form 
// inside of React (with some specific react weirdness we have to account for)
import { useState, type FormEvent, type ChangeEvent } from "react"
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
    const { dispatch } = useTaskContext();

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
                "http://localhost:5130/api/tasks",
                {
                    title: formData.title,
                    description: formData.description,
                    asssignee: formData.assignee,
                    priority: formData.priority
                }
            )

            // We probably want to actually add the task to our list of Tasks in context
            const newTask: Task = response.data;

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

    // Finally, lets build what our TaskForm component will actually render for the user
  return (
    <form className="add-task-form" onSubmit={handleSubmit} noValidate>
        <h2>Add New Task</h2>

        {/* If submiterror has a value, then render the html after the && */}
        {submitError && (
            <div className="alert alert-error">{submitError}</div>
        )}

        <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
                type="text" 
                name="title" 
                id="title" 
                value={formData.title}
                onChange={handleChange}
                className={formErrors.title ? "input-error" : ""}
                disabled={isSubmitting}
            />

            {/* Conditionally render any field specific validation errors below the input */}
            {formErrors.title && <span className="field-error">{formErrors.title}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
                name="description" 
                id="description" 
                value={formData.description}
                onChange={handleChange}
                className={formErrors.description ? "input-error" : ""}
                disabled={isSubmitting}
                rows={3}
            />

            {/* Conditionally render any field specific validation errors below the input */}
            {formErrors.description && <span className="field-error">{formErrors.description}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <input 
                type="text" 
                name="assignee" 
                id="assignee" 
                value={formData.assignee}
                onChange={handleChange}
                className={formErrors.assignee ? "input-error" : ""}
                disabled={isSubmitting}
            />

            {/* Conditionally render any field specific validation errors below the input */}
            {formErrors.assignee && <span className="field-error">{formErrors.assignee}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="priority">Priority</label>

            <select 
                name="priority" 
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
            >
                {/* For a select HTML input element, we need to set the options that are possible */}
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>

        {/* Every form needs a submit button - and we can disable the button 
            to prevent accidental rapid fire duplicate submissions */}
        <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
        >
            {isSubmitting? "Submitting..." : "Create Task"}
        </button>

    </form>
  )
}

export default AddTaskForm