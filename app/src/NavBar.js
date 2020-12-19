import { useHistory } from "react-router-dom";
import { paths, dirSwitch, isLoggedIn } from "./App";

export function NavBar() {
    let history = useHistory();

    const handleClick = (event) => {
        localStorage.setItem("isLoggedIn", false); // IS THIS RIGHT??
        localStorage.setItem("profile", JSON.stringify({})); // ???
        history.push(paths.landing);
    };

    return (
        <>
            {console.log("LOGGED IN? ", isLoggedIn())}
            {isLoggedIn() ? null : history.push(paths.landing)}
            {/* {dirSwitch(null, paths.landing)} */}
            <button type="button" onClick={handleClick}>
                Logout
            </button>
            <div>{localStorage.getItem("profile")}</div>
        </>
    );
}
