import { useEffect } from "react";
import { paths } from "./App";
import { ResourceLocator } from "./ResourceLocator";
import { Matchups } from "./Matchups";
import { RandomImage } from "./RandomImage";
import { Goals } from "./Goals";

/* Home provides home functionality on /p/home */
export function Home() {
    useEffect(() => {
        paths.current = paths.home;
        document.title = "Home";
    });

    return (
        <>
            <div id="image-and-goals-container">
                <RandomImage />
                <Goals />
            </div>
            <Matchups />
            <ResourceLocator />
        </>
    );
}
