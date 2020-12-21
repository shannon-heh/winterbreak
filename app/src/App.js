import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Landing } from "./Landing";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Navigation } from "./Navigation";
import { Home } from "./Home";
import { Profile } from "./Profile";
import "./App.css";

// /* url for app */
// export const url = "http://localhost:3000/";

/* url for server */
export const server = "http://127.0.0.1:5000/";

/* hex codes for react colors */
export const colors = {
    primary: "#1266F1",
    secondary: "#B23CFD",
    success: "#00B74A",
    info: "#39C0ED",
    warning: "#FFA900",
    danger: "#F93154",
    light: "#FBFBFB",
    dark: "#262626",
};

/* endpoints */
export const paths = {
    current: "/" /* current path */,
    base: "/",
    landing: "/landing",
    login: "/login",
    signup: "/sign-up",
    home: "/p/home",
    profile: "/p/profile",
};

/* helper method: returns true if user is logged in, false if not */
export const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem("isLoggedIn"));
};

/* helper method: returns profile data for current user */
export const getProfile = () => {
    return JSON.parse(localStorage.getItem("profile"));
};

/* helper method: displays element text & sets text to "success" color */
export const setSuccessStatus = (element, status) => {
    element.innerHTML = status;
    element.style.color = colors.success;
};

/* helper method: displays element text & sets text to "danger" color */
export const setDangerStatus = (element, status) => {
    element.innerHTML = status;
    element.style.color = colors.danger;
};

/* helper method: sets field as valid */
export const setValidField = (element) => {
    element.classList.remove("is-invalid");
    element.className += " is-valid";
    document.getElementById(element.id + "-status").innerHTML = "";
};

/* helper method: sets field as invalid 
by displaying status and highlighting field as red */
export const setInvalidField = (element) => {
    element.classList.remove("is-valid");
    element.className += " is-invalid";
    const elementStatus = document.getElementById(element.id + "-status");
    setDangerStatus(elementStatus, "Missing/invalid input!");
};

/* App is the parent component and manages initial routing 
to core children components */
function App() {
    return (
        <>
            <Router>
                <Route exact path={paths.base}>
                    <Redirect to={paths.landing} />
                </Route>
                <Route exact path={paths.landing}>
                    <Landing />
                </Route>
                <Route exact path={paths.login}>
                    <Login />
                </Route>
                <Route exact path={paths.signup}>
                    <SignUp />
                </Route>
                <Route path="/p">
                    <Navigation />
                </Route>
                <Route exact path={paths.profile}>
                    <Profile />
                </Route>
                <Route exact path={paths.home}>
                    <Home />
                </Route>
            </Router>
        </>
    );
}

export default App;
