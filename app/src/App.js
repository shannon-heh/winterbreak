import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Landing } from "./Landing";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { NavBar } from "./NavBar";
import { Home } from "./Home";
import { Profile } from "./Profile";

export const colors = {
    "primary":    "#1266F1",
    "secondary":  "#B23CFD",
    "success":    "#00B74A",
    "info":       "#39C0ED",
    "warning":    "#FFA900",
    "danger":     "#F93154",
    "light":      "#FBFBFB",
    "dark":       "#262626"
}

/* endpoints */
export const paths = {
    base: "/",
    landing: "/landing",
    login: "/login",
    signup: "/sign-up",
    home: "/p/home",
    profile: "/p/profile"
};

/* returns true if user is logged in, false if not */
export const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem("isLoggedIn"));
};

/* returns profile data for current user */
export const getProfile = () => {
    return JSON.parse(localStorage.getItem("profile"));
};

export const setValidField = (element) => {
    element.classList.remove("is-invalid");
    element.className += " is-valid";
    document.getElementById(element.id+"_status").innerHTML = "";
}

export const setInvalidField = (element) => {
    element.classList.remove("is-valid");
    element.className += " is-invalid";
    const elementStatus = document.getElementById(element.id+"_status");
    elementStatus.innerHTML = "Missing/invalid input!"
    elementStatus.style.color = colors.danger;
}

/* App is the parent component and manages initial routing to core children components */
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
                    <NavBar />
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
