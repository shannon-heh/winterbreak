import { useHistory } from "react-router-dom";
import { paths, isLoggedIn } from "./App";

/* NavBar provides navbar functionality 
across all pages prefixed with /p/ */
export function NavBar() {
    let history = useHistory();

    /* handles click of home button in navbar */
    const handleHome = (event) => {
        history.push(paths.home);
    };

    /* handles click of profile button in navbar */
    const handleProfile = (event) => {
        history.push(paths.profile);
    };

    /* handles click of logout button in navbar */
    const handleLogout = (event) => {
        localStorage.clear();
        history.push(paths.landing);
    };

    return (
        <>
            {isLoggedIn() ? null : history.push(paths.landing)}
            <button type="button" onClick={handleHome}>
                Home
            </button>
            <button type="button" onClick={handleProfile}>
                Profile
            </button>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </>
    );
}
