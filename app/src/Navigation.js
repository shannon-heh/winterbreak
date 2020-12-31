import { useHistory } from "react-router-dom";
import { paths, isLoggedIn } from "./App";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "./images/logo.svg";

/* NavBar provides navbar functionality 
across all pages prefixed with /p/ */
export function Navigation() {
    let history = useHistory();

    /* handles click of home button in navbar */
    const handleHome = (event) => {
        history.push(paths.home);
    };

    /* handles click of profile button in navbar */
    const handleProfile = (event) => {
        history.push(paths.profile);
    };

    /* handles click of logout button in navbar */
    const handleLogout = (event) => {
        localStorage.clear();
        history.push(paths.landing);
    };

    return (
        <>
            {isLoggedIn() ? null : history.push(paths.landing)}

            <Navbar className="color-nav" expand="lg">
                <Navbar.Brand id="site-name">
                    <img id="logo" src={logo} alt="App Logo"/>
                    Moo Moo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={handleHome}>Home</Nav.Link>
                        <Nav.Link onClick={handleProfile}>Profile</Nav.Link>
                    </Nav>
                    <Navbar.Text id="current-user">
                        Signed in as {localStorage.getItem("username")}
                    </Navbar.Text>
                    <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
                </Navbar.Collapse>
            </Navbar>

            <Navbar className="color-nav justify-content-center" expand="lg" fixed="bottom">
                <Navbar.Text id="current-user">Made with 💕 in 2020</Navbar.Text>
            </Navbar>
        </>
    );
}
