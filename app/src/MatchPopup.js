import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import ReactStars from "react-rating-stars-component";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import breed from "./images/dog.svg";
import email from "./images/email.svg";
import home from "./images/home.svg";
import bday from "./images/birthday-cake.svg";
import weight from "./images/weight-scale.svg";

export function MatchPopup(props) {
    const starColor = "#80cbc4";
    const starSize = 15;

    return (
        <Popup open={props.open} closeOnDocumentClick onClose={props.close}>
            <Container id="profile-container">
                <Row id="profile-row">
                    <Col className="profile-left match-profile-left">
                        <figure>
                            <img
                                className="profile-pic"
                                alt="pet profile"
                                draggable="false"
                                src={props.petImage}
                            />
                            <figcaption id="popup-match-pet-name">
                                {props.profile["pet-name"]}
                            </figcaption>
                        </figure>

                        <figure>
                            <img
                                className="profile-pic"
                                alt="owner profile"
                                draggable="false"
                                src={props.ownerImage}
                            />
                            <figcaption id="popup-match-owner-name">
                                {props.profile["owner-name"]}
                            </figcaption>
                        </figure>

                        <div style={{ marginTop: "30px" }}>
                            {props.profile["duration"] !== "1 min"
                                ? `You're approx ${props.profile["duration"] } apart!`
                                : "You're in the same city!"}
                        </div>
                    </Col>
                    <Col className="profile-middle match-profile-middle">
                        <Row className="pet-info match-pet-info">
                            <header className="panel-title">About the Pet</header>
                            <div>
                                <img src={breed} draggable="false" alt="pet breed" />
                                <span>{props.profile["pet-breed"]}</span>
                            </div>
                            <div>
                                <img src={bday} draggable="false" alt="pet birthday" />
                                <span>{props.profile["pet-bday"]}</span>
                            </div>
                            <div>
                                <img src={weight} draggable="false" alt="pet weight" />
                                <span>{props.profile["pet-weight"]} pounds</span>
                            </div>
                        </Row>
                        <Row className="owner-info match-owner-info">
                            <header className="panel-title">About the Owner</header>
                            <div>
                                <img src={email} draggable="false" alt="owner email" />
                                <span>{props.profile["owner-email"]}</span>
                            </div>
                            <div>
                                <img src={home} draggable="false" alt="owner state" />
                                <span>
                                    {props.profile["owner-city"]},{" "}
                                    {props.profile["owner-state"]}
                                </span>
                            </div>
                        </Row>
                    </Col>
                    <Col className="profile-right match-profile-right">
                        <Row className="pet-metrics match-pet-metrics">
                            <header className="panel-title">Pet Traits</header>
                            <div className="pet-trait">Energy Level</div>
                            <ReactStars
                                value={parseFloat(props.profile.traits["energy-level"])}
                                count={5}
                                size={starSize}
                                isHalf={true}
                                activeColor={starColor}
                                edit={false}
                            />
                            <div className="pet-trait">Dog-Friendly</div>
                            <ReactStars
                                value={parseFloat(props.profile.traits["dog-friendly"])}
                                count={5}
                                size={starSize}
                                isHalf={true}
                                activeColor={starColor}
                                edit={false}
                            />
                            <div className="pet-trait">People-Friendly</div>
                            <ReactStars
                                value={parseFloat(props.profile.traits["people-friendly"])}
                                count={5}
                                size={starSize}
                                isHalf={true}
                                activeColor={starColor}
                                edit={false}
                            />
                            <div className="pet-trait">Tendency to Bark</div>
                            <ReactStars
                                value={parseFloat(
                                    props.profile.traits["tendency-to-bark"]
                                )}
                                count={5}
                                size={starSize}
                                isHalf={true}
                                activeColor={starColor}
                                edit={false}
                            />
                            <br />
                            <div className="pet-interests match-pet-interests">
                                <header className="panel-title">Pet Interests</header>
                                <div>{props.profile.interests}</div>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Popup>
    );
}