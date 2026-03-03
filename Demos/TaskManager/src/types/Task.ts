// This is not .tsx or React specific code
// its just a domain model for what a "task" should be
// as defined by my little task manager project

export interface Task {
    id: number;
    title: string;
    description: string;
    assignee: string;
    //ts enum, status can ONLY be one of these values
    status: "todo" | "in-progress" | "done"; 
    priority: "low" | "medium" | "high"
}
