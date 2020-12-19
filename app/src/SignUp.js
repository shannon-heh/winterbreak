import axios from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { paths } from "./App";

export function SignUp() {
    let history = useHistory();

    useEffect(() => {
        document.title = "Sign Up";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        let profile = {};

        const form = event.target;
        profile.username = form.username.value;
        profile.password = form.password.value;
        profile.pet_name = form.pet_name.value;
        profile.pet_breed = form.pet_breed.value;
        profile.pet_bday = form.pet_bday.value;
        profile.pet_weight = form.pet_weight.value;
        profile.owner_name = form.owner_name.value;
        profile.owner_email = form.owner_email.value;

        axios.post("http://127.0.0.1:5000/create_user", profile).then(
            (res) => {
                console.log("SUCCESS: ", res);
                history.push(paths.login);
            },
            (error) => {
                console.log("FAILURE: ", error);
            }
        );
    };

    const handleBlur = (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const submitBtn = document.getElementById("submit");
        const usernameStatus = document.getElementById("username_status");

        /* username not provided */
        if (!username) {
            submitBtn.disabled = true;
            usernameStatus.innerHTML = "";
            return;
        }

        /* invalid username format */
        if (!username.match(/^\w+$/)) {
            submitBtn.disabled = true;
            usernameStatus.innerHTML =
                "Username must contain only letters, numbers, and/or _.";
            return;
        }

        const name = { username: username };

        axios.post("http://127.0.0.1:5000/check_user", name).then(
            (res) => {
                /* username already exists */
                submitBtn.disabled = true;
                usernameStatus.innerHTML = "Username Unavailable!";
            },
            (error) => {
                /* username doesn't exist */
                submitBtn.disabled = false;
                usernameStatus.innerHTML = "Username Available!";
            }
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    id="username"
                    type="text"
                    name="username"
                    defaultValue=""
                    placeholder="e.g. goldenlucky1"
                    onBlur={handleBlur}
                    required
                />
            </label>
            <span id="username_status"></span>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    defaultValue=""
                    placeholder="Choose a strong password!"
                    required
                />
            </label>
            <br />
            <br />
            Pet Information
            <br />
            <label>
                Pet's Name:
                <input
                    type="text"
                    name="pet_name"
                    placeholder="e.g. Lucky"
                    required
                />
            </label>
            <br />
            <label>
                Pet's Breed:
                <input
                    type="text"
                    name="pet_breed"
                    placeholder="e.g. Golden Retriever"
                    required
                />
            </label>
            <br />
            <label>
                Pet's Birthday:
                <input type="month" name="pet_bday" required />
            </label>
            <br />
            <label>
                Pet's Weight:
                <input
                    type="number"
                    name="pet_weight"
                    placeholder="in pounds"
                    required
                />
            </label>
            <br />
            <br />
            Owner Information
            <br />
            <label>
                Owner's Name:
                <input
                    type="text"
                    name="owner_name"
                    placeholder="Jane Doe"
                    required
                />
            </label>
            <br />
            <label>
                Owner's Email:
                <input
                    type="email"
                    name="owner_email"
                    placeholder="jane.doe@gmail.com"
                    required
                />
            </label>
            <br />
            <input id="submit" type="submit" value="Let's Go!" disabled />
        </form>
    );
}
