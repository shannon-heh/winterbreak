import { useEffect } from "react";
import { paths } from "./App";
import { ResourceLocator } from "./ResourceLocator";
import { Matchups } from "./Matchups";

/* Home provides home functionality on /p/home */
export function Home() {
    useEffect(() => {
        paths.current = paths.home;
        document.title = "Home";
    });

    return (
    <>
        <Matchups />
        {/* <ResourceLocator /> */}
    </>
    );
}
