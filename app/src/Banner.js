import Navbar from "react-bootstrap/Navbar";
import logo from "./images/logo.svg";

export function Banner() {
    return (
        <>
            <Navbar className="color-nav justify-content-center" expand="lg" fixed="top">
                <Navbar.Brand id="site-name" href="/landing">
                    <img id="logo" src={logo} alt="logo" />
                    Winterbreak
                </Navbar.Brand>
            </Navbar>

            <Navbar className="color-nav justify-content-center" expand="lg" fixed="bottom">
                <Navbar.Text id="current-user">Made with 💕 in 2020</Navbar.Text>
            </Navbar>
        </>
    );
}
