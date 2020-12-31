import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { paths } from "./App";
import Button from "react-bootstrap/Button";
import ReactStars from "react-rating-stars-component";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import breed from "./images/dog.svg";
import email from "./images/email.svg";
import home from "./images/home.svg";
import bday from "./images/birthday-cake.svg";
import weight from "./images/weight-scale.svg";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let history = useHistory();

    let profile = JSON.parse(localStorage.getItem("profile"));
    let qualities = JSON.parse(localStorage.getItem("qualities"));
    let petImage = localStorage.getItem("pet-image");
    let ownerImage = localStorage.getItem("owner-image");

    const starColor = "#80cbc4";
    const starSize = 20;

    /* fetches and renders pet and owner pictures upon page load and/or new picture upload */
    useEffect(() => {
        paths.current = paths.profile;
        document.title = "Profile";
    }, []);

    const handleEditProfile = (event) => {
        history.push(paths.edit_profile);
    };

    return (
        <Container id="profile-container">
            <Row id="profile-row">
                <Col id="profile-left">
                    <figure>
                        <img
                            id="pet-image"
                            className="profile-pic"
                            src={petImage}
                            alt="pet profile"
                            draggable="false"
                        />
                        <figcaption>{profile["pet-name"]}</figcaption>
                    </figure>

                    <figure>
                        <img
                            id="owner-image"
                            className="profile-pic"
                            src={ownerImage}
                            alt="owner profile"
                            draggable="false"
                        />
                        <figcaption>{profile["owner-name"]}</figcaption>
                    </figure>
                    <div id="profile-buttons">
                        <Button variant="info" id="edit-profile" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                    </div>
                </Col>
                <Col id="profile-middle">
                    <Row id="pet-info">
                        <header className="panel-title">About the Pet</header>
                        <div>
                            <img src={breed} draggable="false" alt="pet breed" />
                            <span>{profile["pet-breed"]}</span>
                        </div>
                        <div>
                            <img src={bday} draggable="false" alt="pet birthday" />
                            <span>{profile["pet-bday"]}</span>
                        </div>
                        <div>
                            <img src={weight} draggable="false" alt="pet weight" />
                            <span>{profile["pet-weight"]} pounds</span>
                        </div>
                    </Row>
                    <Row id="owner-info">
                        <header className="panel-title">About the Owner</header>
                        <div>
                            <img src={email} draggable="false" alt="owner email" />
                            <span>{profile["owner-email"]}</span>
                        </div>
                        <div>
                            <img src={home} draggable="false" alt="owner state" />
                            <span>
                                {profile["owner-city"]}, {profile["owner-state"]}
                            </span>
                        </div>
                    </Row>
                </Col>
                <Col id="profile-right">
                    <Row id="pet-metrics">
                        <header className="panel-title">Pet Traits</header>
                        <div className="pet-trait">Energy Level</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={parseFloat(qualities.traits["energy-level"])}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">Dog-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={parseFloat(qualities.traits["dog-friendly"])}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">People-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={parseFloat(qualities.traits["people-friendly"])}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">Tendency to Bark</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={parseFloat(qualities.traits["tendency-to-bark"])}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <br />
                        <div id="pet-interests">
                            <header className="panel-title">Pet Interests</header>
                            <div>{qualities["interests"]}</div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
