import { useEffect } from "react";
import { paths } from "./App";

/* Home provides home functionality on /p/home */
export function Home() {
    useEffect(() => {
        paths.current = paths.home;
        document.title = "Home";
    });

    return <div>home</div>;
}
