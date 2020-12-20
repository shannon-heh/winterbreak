import axios from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { paths, setDangerStatus, setSuccessStatus, isLoggedIn, setInvalidField, setValidField, server } from "./App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

/* SignUp provides user registration functionality on /sign-up */
export function SignUp() {
    let history = useHistory();

    useEffect(() => {
        paths.current = paths.signup;
        document.title = "Sign Up";
    }, []);

    /* if user correctly fills out sign up fields,
    adds user profile to database and navigates to login page */
    const handleSubmit = (event) => {
        event.preventDefault();

        let profile = {};

        const form = event.target;
        const fields = [
            form.username,
            form.password,
            form.pet_name,
            form.pet_breed,
            form.pet_bday,
            form.pet_weight,
            form.owner_name,
            form.owner_email,
            form.owner_city,
            form.owner_state,
        ];

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
        if (existInvalidField) return;

        axios.post(`${server}create_user`, profile).then(
            (res) => {
                history.push(paths.login);
            },
            (error) => {
                console.log("USER CREATION FAILED: ", error);
            }
        );
    };

    /* when user clicks out of a field, 
    set field as invalid if field is empty, 
    or set field as valid otherwise */
    const handleBlur = (event) => {
        event.preventDefault();

        if (!event.target.value) setInvalidField(event.target);
        else setValidField(event.target);
    };

    /* when user clicks out of username field, 
    verifies availability and format of username */
    const handleUsernameBlur = (event) => {
        event.preventDefault();

        const usernameField = document.getElementById("username");
        const username = usernameField.value;
        const usernameStatus = document.getElementById("username_status");

        /* username not provided */
        if (!username) {
            setInvalidField(usernameField);
            usernameStatus.innerHTML = "";
            return;
        }

        /* invalid username format */
        if (!username.match(/^\w+$/)) {
            setInvalidField(usernameField);
            setDangerStatus(usernameStatus, "Username must contain only letters, numbers, and/or _.");
            return;
        }

        const name = { username: username };

        axios.post(`${server}check_user`, name).then(
            (res) => {
                /* username already exists */
                setInvalidField(usernameField);
                setDangerStatus(usernameStatus, "Username Unavailable!");
            },
            (error) => {
                /* username doesn't exist */
                setValidField(usernameField);
                setSuccessStatus(usernameStatus, "Username Available!");
            }
        );
    };

    return (
        <>
            {isLoggedIn() ? history.push(paths.home) : null}
            <Form onSubmit={handleSubmit} className="needs-validation">
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        id="username"
                        type="text"
                        placeholder="Username"
                        defaultValue=""
                        onBlur={handleUsernameBlur}
                    />
                    <Form.Text id="username_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        id="password"
                        type="password"
                        placeholder="Password"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="password_status" />
                </Form.Group>
 
                <Form.Group>
                    <Form.Label>Pet's Name</Form.Label>
                    <Form.Control
                        id="pet_name"
                        type="text"
                        placeholder="e.g. Lucky"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="pet_name_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Pet's Breed</Form.Label>
                    <Form.Control
                        id="pet_breed"
                        type="text"
                        placeholder="e.g. Golden Retriever"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="pet_breed_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Pet's Birthday</Form.Label>
                    <Form.Control id="pet_bday" type="month" onBlur={handleBlur} />
                    <Form.Text id="pet_bday_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Pet's Weight</Form.Label>
                    <Form.Control
                        id="pet_weight"
                        type="number"
                        placeholder="In pounds"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="pet_weight_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Owner's Name</Form.Label>
                    <Form.Control
                        id="owner_name"
                        type="text"
                        placeholder="e.g. Jane Doe"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="owner_name_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Owner's Email</Form.Label>
                    <Form.Control
                        id="owner_email"
                        type="email"
                        placeholder="e.g. jane.doe@gmail.com"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="owner_email_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Owner's City</Form.Label>
                    <Form.Control
                        id="owner_city"
                        type="text"
                        placeholder="e.g. Los Angeles"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="owner_city_status" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Owner's State</Form.Label>
                    <Form.Control
                        id="owner_state"
                        type="text"
                        placeholder="e.g. CA"
                        defaultValue=""
                        onBlur={handleBlur}
                    />
                    <Form.Text id="owner_state_status" />
                </Form.Group> 

                <Button variant="primary" id="signup_submit" type="submit">
                    Let's Go!
                </Button>
            </Form>
        </>
    );
}
