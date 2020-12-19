import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect, useHistory, Link } from "react-router-dom";
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

export const dirSwitch = (pathIfLoggedIn, pathIfLoggedOut) => {
    console.log("IN DIR SWITCH ", isLoggedIn());
    console.log(pathIfLoggedIn, pathIfLoggedOut)
    if (isLoggedIn()) {
        if (pathIfLoggedIn !== null)
            return <Link to={pathIfLoggedIn} />;
        else return null;
    }
    // return !pathIfLoggedIn ? null : <Redirect to={pathIfLoggedIn} />;

    if (pathIfLoggedOut !== null) return <Link to={pathIfLoggedOut} />;
    else return null;
};

// export const dirSwitch = (pathIfLoggedIn, pathIfLoggedOut) => {
//     let history = useHistory();
//     // return <Redirect to="/" />;
//     if (isLoggedIn()) {
//         if (pathIfLoggedIn) history.push(pathIfLoggedIn);
//         return;
//     }

//     if (pathIfLoggedOut) history.push(pathIfLoggedOut);
// };

function App() {

    return (
        <>
            <Router>
                <Switch>
                <Route exact path="/">
                    {dirSwitch(paths.home, paths.landing)}
                </Route>
                <Route exact path={paths.landing}>
                    <Landing />
                    {/* {dirSwitch(paths.home, null)} */}
                </Route>
                <Route exact path={paths.login}>
                    <Login />
                    {/* {dirSwitch(paths.home, null)} */}
                </Route>
                <Route exact path={paths.signup}>
                    <SignUp />
                    {/* {dirSwitch(paths.home, null)} */}
                </Route>
                <Route exact path={paths.home}>
                    {/* {console.log("fuck me")} */}
                    <NavBar />
                    {/* {dirSwitch(null, paths.landing)} */}
                </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
