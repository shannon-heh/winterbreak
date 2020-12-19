import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Landing } from "./Landing";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { NavBar } from "./NavBar";

/* endpoints */
export const paths = {
    base: "/",
    landing: "/landing",
    login: "/login",
    signup: "/sign-up",
    home: "/p/home",
};

/* returns true if user is logged in, false if not */
export const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem("isLoggedIn"));
};

/* returns profile data for current user */
export const getProfile = () => {
    return JSON.parse(localStorage.getItem("profile"));
};

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
            </Router>
        </>
    );
}

export default App;
