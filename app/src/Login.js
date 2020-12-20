import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { paths, isLoggedIn, setInvalidField, server, setSuccessStatus, setDangerStatus } from "./App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

/* Login provides user login functionality on /login */
export function Login() {
    let history = useHistory();

    useEffect(() => {
        /* displays successful profile creation status if previous
        url was sign up page */
        const creationStatus =  document.getElementById("creation_status");
        if(paths.current === paths.signup)
            setSuccessStatus(creationStatus, "Successful Profile Creation!");
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

        const usernameStatus = document.getElementById("username_status");
        const passwordStatus = document.getElementById("password_status");

        axios.post(`${server}auth`, credentials).then(
            (res) => {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("profile", JSON.stringify(res.data));
                history.push(paths.home);
            },
            (error) => {
                usernameStatus.innerHTML = "";
                setDangerStatus(passwordStatus, "Invalid username and/or password!")
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
            document.getElementById(event.target.id + "_status").innerHTML = "";
        }
    };

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
            <div id="creation_status"></div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        onBlur={handleBlur}
                    />
                    <Form.Text id="username_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onBlur={handleBlur}
                    />
                    <Form.Text id="password_status" />
                </Form.Group>

                <Button variant="primary" id="login_submit" type="submit">
                    Let's Go!
                </Button>
            </Form>
        </>
    );
}
