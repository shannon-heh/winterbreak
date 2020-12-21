import { useHistory } from "react-router-dom";
import { paths, isLoggedIn } from "./App";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

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
            <Navbar bg="light" expand="lg">
              <Navbar.Brand onClick={handleHome}>Moo Moos' Petshop</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link onClick={handleHome}>Home</Nav.Link>
                  <Nav.Link onClick={handleProfile}>Profile</Nav.Link>
                </Nav>
                <Button onClick={handleLogout} variant="info">Logout</Button>
              </Navbar.Collapse>
            </Navbar>
        </>
    );
}
