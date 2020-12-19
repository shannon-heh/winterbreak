import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
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
    return localStorage.getItem("isLoggedIn") === "true";
};

function App() {
    const dirSwitch = (pathIfLoggedIn, pathIfLoggedOut) => {
        console.log("IS LOGGED IN: ", isLoggedIn());
        if (isLoggedIn()) {
            if (pathIfLoggedIn !== null)
                return <Redirect to={pathIfLoggedIn} />;
            else return;
        }
        // return !pathIfLoggedIn ? null : <Redirect to={pathIfLoggedIn} />;

        if (pathIfLoggedOut !== null) return <Redirect to={pathIfLoggedOut} />;
        else return;
    };

    /*
      const dirSwitch = (pathIfLoggedIn, pathIfLoggedOut) => {
        // return <Redirect to="/" />;
        console.log(localStorage.getItem("isLoggedIn"));
        if (localStorage.getItem("isLoggedIn") === "true") {
            if (pathIfLoggedIn) history.push(pathIfLoggedIn);
            return;
        }

        if (pathIfLoggedOut) history.push(pathIfLoggedOut);
    };
    */

    return (
        <>
            <Router>
                <Route exact path="/">
                    {dirSwitch(paths.home, paths.landing)}
                </Route>
                <Route exact path={paths.landing}>
                    <Landing />
                    {dirSwitch(paths.home, null)}
                </Route>
                <Route exact path={paths.login}>
                    <Login />
                    {dirSwitch(paths.home, null)}
                </Route>
                <Route exact path={paths.signup}>
                    <SignUp />
                    {dirSwitch(paths.home, null)}
                </Route>
                <Route exact path="/p/home">
                    {console.log("fuck me")}
                    <NavBar />
                    {/* {dirSwitch(null, paths.landing)} */}
                </Route>
            </Router>
        </>
    );
}

export default App;
