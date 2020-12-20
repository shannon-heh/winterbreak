import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { paths, colors, isLoggedIn, setInvalidField } from "./App";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Login provides user login functionality on /login */
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
        const fields = [form.username, form.password];
       
        let existInvalidField = false;

        fields.forEach(element => {
            const id = element.id;
            credentials[id] = element.value;
            if (!credentials[id]) {
                existInvalidField = true;
                setInvalidField(element);
            }
        });
        
        if (existInvalidField) return;

        const usernameStatus = document.getElementById("username_status");
        const passwordStatus = document.getElementById("password_status");

        axios.post("http://127.0.0.1:5000/auth", credentials).then(
            (res) => {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("profile", JSON.stringify(res.data));
                history.push(paths.home);
            },
            (error) => {
                usernameStatus.innerHTML = "";
                passwordStatus.innerHTML = "Invalid username and/or password!";
                passwordStatus.style.color = colors.danger;
            }
        );
    };


    const handleBlur = (event) => {
        event.preventDefault();

        if (!event.target.value) setInvalidField(event.target);
        else {
            event.target.classList.remove("is-invalid");
            document.getElementById(event.target.id+"_status").innerHTML = "";
        }
    }

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
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
