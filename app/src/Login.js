import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    paths,
    isLoggedIn,
    setInvalidField,
    server,
    setSuccessStatus,
    setDangerStatus,
} from "./App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

/* Login provides user login functionality on /login */
export function Login() {
    let history = useHistory();

    useEffect(() => {
        /* displays successful profile creation status if previous
        url was sign up page */
        const creationStatus = document.getElementById("creation-status");
        if (paths.current === paths.signup)
            setSuccessStatus(creationStatus, "Profile successfully created!");
        else creationStatus.innerHTML = "";

        paths.current = paths.login;
        document.title = "Login";
    }, []);

    /* verifies login credentials
    navigates to user home if successful
    or displays error message if unsuccessful */
    const handleSubmit = (event) => {
        event.preventDefault();

        let credentials = {};

        const form = event.target;
        const fields = [form.username, form.password];

        let existInvalidField = false;

        /* checks validity of each input field */
        fields.forEach((element) => {
            const id = element.id;
            credentials[id] = element.value;
            if (!credentials[id]) {
                existInvalidField = true;
                setInvalidField(element);
            }
        });

        /* do not proceed to user home if any field is invalid */
        if (existInvalidField) return;

        const usernameStatus = document.getElementById("username-status");
        const passwordStatus = document.getElementById("password-status");

        axios.post(`${server}auth`, credentials).then(
            (res) => {
                localStorage.setItem("isLoggedIn", true);
                const profile = res.data;
                localStorage.setItem("profile", JSON.stringify(profile));
                localStorage.setItem(
                    "username",
                    JSON.stringify(profile["username"]).replace(/['"]+/g, "")
                );
                localStorage.setItem(
                    "password",
                    JSON.stringify(profile["password"]).replace(/['"]+/g, "")
                );
                history.push(paths.home);
            },
            (error) => {
                usernameStatus.innerHTML = "";
                setDangerStatus(passwordStatus, "Invalid username and/or password!");
            }
        );
    };

    /* when user clicks out of a field, 
    set field as invalid if field is empty */
    const handleBlur = (event) => {
        event.preventDefault();

        if (!event.target.value) setInvalidField(event.target);
        else {
            event.target.classList.remove("is-invalid");
            document.getElementById(event.target.id + "-status").innerHTML = "";
        }
    };

    return (
        <div id="login-form">
            {isLoggedIn() ? history.push(paths.home) : null}
            <div id="creation-status"></div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control id="username" name="username" type="text" onBlur={handleBlur} />
                    <Form.Text id="username-status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        id="password"
                        name="password"
                        type="password"
                        onBlur={handleBlur}
                    />
                    <Form.Text id="password-status" />
                </Form.Group>
                <Button variant="info" id="login-submit" type="submit">
                    Let's Go!
                </Button>
            </Form>
        </div>
    );
}
