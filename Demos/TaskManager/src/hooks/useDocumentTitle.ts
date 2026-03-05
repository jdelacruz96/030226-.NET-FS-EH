//Writing our own custom hook that leverages useEffect

//We'll start simple - we want to run some code whenever some information changes
import { useEffect } from "react";


export function useDocumentTitle(title: string): void {
    //useEffect runs AFTER the component renders
    useEffect(() => {
        
        //Set the browser tab title to whatever we passed in
        document.title = title;
        // Sometimes, depending on what you're doing - you want to include some
        // cleanup logic - closing websockets, etc - as part of useEffect. 
        // This change is so simple there's nothing to clean up.


    }, [title]) //rerun the above whenever the value of title changes

}