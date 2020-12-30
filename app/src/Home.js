import { useEffect } from "react";
import { paths } from "./App";
import { ResourceLocator } from "./ResourceLocator";

/* Home provides home functionality on /p/home */
export function Home() {
    useEffect(() => {
        paths.current = paths.home;
        document.title = "Home";
    });

    return (

        <ResourceLocator />
    
    );
}
