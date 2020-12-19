import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Landing } from "./Landing";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { NavBar } from "./NavBar";

export const paths = {
    landing: "/landing",
    login: "/login",
    signup: "/sign-up",
    home: "/p/home",
};

export const isLoggedIn = () => {
    return JSON.parse(localStorage.getItem("isLoggedIn"));
};

export const getProfile = () => {
    return JSON.parse(localStorage.getItem("profile"));
};

function App() {
    return (
        <>
            <Router>
                <Route exact path="/">
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
