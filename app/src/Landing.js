import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { paths, isLoggedIn } from "./App";
import Button from "react-bootstrap/Button";

/* Landing provides functionality for the logged-out state */
export function Landing() {
    let history = useHistory();

    useEffect(() => {
        paths.current = paths.landing;
        document.title = "Landing";
    }, []);

    /* navigates to login or signup page */
    const handleClick = (event) => {
        if (event.target.id === "login_button") history.push(paths.login);
        else history.push(paths.signup);
    };

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
            <Button variant="primary" id="login_button" onClick={handleClick}>
                Login
            </Button>
            <Button variant="primary" id="signup_button" onClick={handleClick}>
                Sign Up
            </Button>
        </>
    );
}
