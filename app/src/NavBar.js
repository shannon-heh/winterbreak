import { useHistory } from "react-router-dom";
import { paths } from "./App";

export function NavBar() {
    let history = useHistory();

    const handleClick = (event) => {
        localStorage.setItem("isLoggedIn", false); // IS THIS RIGHT??
        // console.log("CUM HERE: ", paths.landing);
        history.push(paths.landing);
    };

    return (
        <>
            <button type="button" onClick={handleClick}>
                Logout
            </button>
            <div>{localStorage.getItem("profile")}</div>
        </>
    );
}
