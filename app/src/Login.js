import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { paths, isLoggedIn } from "./App";

export function Login() {
    let history = useHistory();

    useEffect(() => {
        document.title = "Login";
    }, []);

    /* verifies login credentials
    navigates to user home if successful 
    or displays error message if unsuccessful */
    const handleSubmit = (event) => {
        event.preventDefault();

        let credentials = {};

        const form = event.target;
        credentials.username = form.username.value;
        credentials.password = form.password.value;

        const loginStatus = document.getElementById("login_status");

        axios.post("http://127.0.0.1:5000/auth", credentials).then(
            (res) => {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("profile", JSON.stringify(res.data));
                loginStatus.innerHTML = "Success!";
                history.push(paths.home);
            },
            (error) => {
                loginStatus.innerHTML = "Invalid Username and/or Password!";
            }
        );
    };

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" defaultValue="" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" defaultValue="" required />
                </label>
                <div id="login_status"></div>
                <input id="login_submit" type="submit" value="Let's Go!" />
            </form>
        </>
    );
}
