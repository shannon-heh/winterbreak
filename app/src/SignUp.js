import axios from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import {
    paths,
    setDangerStatus,
    setSuccessStatus,
    isLoggedIn,
    setInvalidField,
    setValidField,
    server,
} from "./App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

/* SignUp provides user registration functionality on /sign-up */
export function SignUp() {
    let history = useHistory();

    useEffect(() => {
        paths.current = paths.signup;
        document.title = "Sign Up";
    }, []);

    /* enable the submit button */
    const enableSubmit = () => {
        document.getElementById("signup-submit").disabled = false;
        document.getElementById("signup-submit").style.cursor = "pointer";
    };

    /* disable the submit button */
    const disableSubmit = () => {
        document.getElementById("signup-submit").disabled = true;
        document.getElementById("signup-submit").style.cursor = "not-allowed";
    };

    /* checks that a username is non-empty, consists of only letters, 
    numbers, and/or _, and is available in the database */
    const isUsernameValid = () => {
        const usernameField = document.getElementById("username");
        const usernameStatus = document.getElementById("username-status");
        const username = usernameField.value;

        /* username not provided */
        if (!username) {
            setInvalidField(usernameField);
            disableSubmit();
            return false;
        }

        /* invalid username format */
        if (!username.match(/^\w+$/)) {
            setInvalidField(usernameField);
            setDangerStatus(
                usernameStatus,
                "Username must contain only letters, numbers, and/or _."
            );
            disableSubmit();
            return false;
        }

        const name = { username: username };
        axios.post(`${server}check_user`, name).then(
            (res) => {
                /* username already exists */
                setInvalidField(usernameField);
                setDangerStatus(usernameStatus, "Username unavailable!");
                disableSubmit();
            },
            (error) => {
                /* username doesn't exist */
                setValidField(usernameField);
                setSuccessStatus(usernameStatus, "");
                enableSubmit();
            }
        );

        return true;
    };

    /* if user correctly fills out sign up fields,
    adds user profile to database and navigates to login page */
    const handleSubmit = (event) => {
        event.preventDefault();

        let spinner = document.getElementById("signup-spinner");
        let submitBtn = document.getElementById("signup-submit");

        spinner.style = "display: inline-block;";
        submitBtn.disabled = true;

        let profile = {};

        const form = event.target;
        const fields = [
            form.password,
            form["pet-name"],
            form["pet-breed"],
            form["pet-bday"],
            form["pet-weight"],
            form["owner-name"],
            form["owner-email"],
            form["owner-city"],
            form["owner-state"],
        ];

        profile.username = form.username.value;
        let existInvalidField = false;

        /* checks validity of each input field */
        fields.forEach((element) => {
            const id = element.id;
            profile[id] = element.value;
            if (!profile[id]) {
                existInvalidField = true;
                setInvalidField(element);
            }
        });

        /* do not proceed to login if any field is invalid */
        if (existInvalidField) {
            spinner.style = "display: none;";
            disableSubmit();
            return;
        }

        /* invalid username format */
        existInvalidField = !isUsernameValid();

        /* enable the submit button if all checks pass */
        enableSubmit();

        axios.post(`${server}create_user`, profile).then(
            (res) => {
                history.push(paths.login);
            },
            (error) => {}
        );
    };

    /* when user clicks out of a field, 
    set field as invalid if field is empty and disable the submit button, 
    otherwise set field as valid and enable the submit button */
    const handleBlur = (event) => {
        event.preventDefault();

        if (!event.target.value) {
            setInvalidField(event.target);
            disableSubmit();
        } else {
            setValidField(event.target);
            enableSubmit();
        }
    };

    /* when user clicks out of username field, 
    verifies availability and format of username */
    const handleUsernameBlur = (event) => {
        event.preventDefault();

        isUsernameValid();
    };

    return (
        <div id="signup-form">
            {isLoggedIn() ? history.push(paths.home) : null}
            <Form onSubmit={handleSubmit} className="needs-validation">
                <table>
                    <tr>
                        <td className="left-col">
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    id="username"
                                    type="text"
                                    defaultValue=""
                                    onBlur={handleUsernameBlur}
                                />
                                <Form.Text id="username-status" />
                            </Form.Group>
                        </td>
                        <td className="right-col">
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    id="password"
                                    type="password"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="password-status" />
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td className="left-col">
                            <Form.Group>
                                <Form.Label>Pet's Name</Form.Label>
                                <Form.Control
                                    id="pet-name"
                                    type="text"
                                    placeholder="e.g. Lucky"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="pet-name-status" />
                            </Form.Group>
                        </td>
                        <td className="right-col">
                            <Form.Group>
                                <Form.Label>Pet's Breed</Form.Label>
                                <Form.Control
                                    id="pet-breed"
                                    type="text"
                                    placeholder="e.g. Golden Retriever"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="pet-breed-status" />
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td className="left-col">
                            <Form.Group>
                                <Form.Label>Pet's Birthday</Form.Label>
                                <Form.Control id="pet-bday" type="month" onBlur={handleBlur} />
                                <Form.Text id="pet-bday-status" />
                            </Form.Group>
                        </td>
                        <td className="right-col">
                            <Form.Group>
                                <Form.Label>Pet's Weight</Form.Label>
                                <Form.Control
                                    id="pet-weight"
                                    type="number"
                                    placeholder="In pounds"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="pet-weight-status" />
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td className="left-col">
                            <Form.Group>
                                <Form.Label>Owner's Name</Form.Label>
                                <Form.Control
                                    id="owner-name"
                                    type="text"
                                    placeholder="e.g. Jane Doe"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="owner-name-status" />
                            </Form.Group>
                        </td>

                        <td className="right-col">
                            <Form.Group>
                                <Form.Label>Owner's Email</Form.Label>
                                <Form.Control
                                    id="owner-email"
                                    type="email"
                                    placeholder="e.g. jane.doe@gmail.com"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="owner-email-status" />
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td className="left-col">
                            <Form.Group>
                                <Form.Label>Owner's City</Form.Label>
                                <Form.Control
                                    id="owner-city"
                                    type="text"
                                    placeholder="e.g. Los Angeles"
                                    defaultValue=""
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="owner-city-status" />
                            </Form.Group>
                        </td>

                        <td className="right-col">
                            <Form.Group>
                                <Form.Label>Owner's State</Form.Label>
                                <Form.Control
                                    id="owner-state"
                                    type="text"
                                    placeholder="e.g. CA"
                                    defaultValue=""
                                    maxLength="2"
                                    onBlur={handleBlur}
                                />
                                <Form.Text id="owner-state-status" />
                            </Form.Group>
                        </td>
                    </tr>
                </table>
                <Button variant="info" id="signup-submit" type="submit">
                    Let's Go!{" "}
                    <Spinner id="signup-spinner" animation="border" variant="light" size="sm" />
                </Button>
            </Form>
        </div>
    );
}
