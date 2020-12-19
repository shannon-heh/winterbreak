import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { paths, isLoggedIn } from "./App";

export function Landing() {
    let history = useHistory();

    useEffect(() => {
        document.title = "Landing";
    }, []);

    const handleClick = (event) => {
        if (event.target.id === "login_button") history.push(paths.login);
        else history.push(paths.signup);
    };

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
            <button id="login_button" type="button" onClick={handleClick}>
                Login
            </button>
            <button id="signup_button" type="button" onClick={handleClick}>
                Sign Up
            </button>
        </>
    );
}
