import { useHistory } from "react-router-dom";
import { paths, isLoggedIn } from "./App";

export function NavBar() {
    let history = useHistory();

    const handleClick = (event) => {
        localStorage.setItem("isLoggedIn", false);
        localStorage.setItem("profile", JSON.stringify({}));
        history.push(paths.landing);
    };

    return (
        <>
            {isLoggedIn() ? null : history.push(paths.landing)}
            <button type="button" onClick={handleClick}>
                Logout
            </button>
            <div>{localStorage.getItem("profile")}</div>
        </>
    );
}
