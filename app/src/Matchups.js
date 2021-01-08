import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "./App";
import Button from "react-bootstrap/Button";
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

export function Matchups() {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const starColor = "#80cbc4";
    const starSize = 15;

    const [currMatchDuration, setCurrMatchDuration] = useState("");
    const [currMatchProfile, setCurrMatchProfile] = useState({});
    const [currMatchQualities, setCurrMatchQualities] = useState({ traits: {} });
    const [currMatchPetImage, setCurrMatchPetImage] = useState("");
    const [currMatchOwnerImage, setCurrMatchOwnerImage] = useState("");

    let currMatchUsername = "";

    const getNextMatch = () => {
        const credentials = {
            username: username,
            password: password,
        };

        axios.post(`${server}get_next_match`, credentials).then(
            (res) => {
                currMatchUsername = res.data["username"];

                setCurrMatchDuration(res.data["duration"]);

                const matchImage = {
                    username: username,
                    password: password,
                    image_type: "pet",
                    match_username: currMatchUsername,
                };

                axios.post(`${server}get_picture`, matchImage).then(
                    (res) => {
                        setCurrMatchPetImage(`data:image/png;base64,${res.data}`);
                    },
                    (error) => {}
                );

                matchImage.image_type = "owner";

                axios.post(`${server}get_picture`, matchImage).then(
                    (res) => {
                        setCurrMatchOwnerImage(`data:image/png;base64,${res.data}`);
                    },
                    (error) => {}
                );

                const credentials = {
                    username: username,
                    password: password,
                    match_username: currMatchUsername,
                };

                axios.post(`${server}get_match_profile`, credentials).then(
                    (res) => {
                        setCurrMatchProfile(res.data);
                    },
                    (error) => {}
                );

                axios.post(`${server}get_qualities`, credentials).then(
                    (res) => {
                        setCurrMatchQualities(res.data);
                    },
                    (error) => {}
                );
            },
            (error) => {
                if (error.response.status === 404) {
                    document.getElementById("match-profile").style.display = "none";
                    document.getElementById("about-match-button").disabled = true;
                    document.getElementById("save-match-button").disabled = true;
                    document.getElementById("no-thanks-button").disabled = true;
                    document.getElementById("no-match-message").innerHTML =
                        "No more matches - check back later!";
                }
            }
        );
    };

    const getSavedMatches = () => {
        const credentials = {
            username: username,
            password: password,
        };

        const savedMatchesList = document.getElementById("saved-matches-list");

        axios.post(`${server}get_saved_matches`, credentials).then(
            (res) => {
                const matches = res.data;
                Object.keys(matches).forEach((username) => {
                    let matchItem = document.createElement("LI");
                    matchItem.innerHTML = `${matches[username]["pet-name"]}, ${matches[username]["pet-breed"]}`;
                    savedMatchesList.appendChild(matchItem);
                });
            },
            (error) => {}
        );
    };

    useEffect(() => {
        getNextMatch();
        getSavedMatches();
    }, []);

    useEffect(() => {
        console.log("rerender occurred");
    }, [
        currMatchDuration,
        currMatchPetImage,
        currMatchOwnerImage,
        currMatchProfile,
        currMatchQualities,
    ]);

    const handleAboutMatch = () => {
        setOpen((o) => !o);
    };

    const handleSaveMatch = () => {
        // call to backend to update status of current match (currMatchUsername)
        // add match as li to saved matches list
        // getNextMatch

        const credentials = {
            username: username,
            password: password,
            match_username: currMatchProfile["username"],
            action: "save",
        };

        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                console.log("successful match!");
                getNextMatch();
            },
            (error) => {
                console.log(error);
            }
        );

        const savedMatchesList = document.getElementById("saved-matches-list");

        /* add current match to saved matches list */
        const matchItem = document.createElement("LI");
        matchItem.innerHTML = `${currMatchProfile["pet-name"]}, ${currMatchProfile["pet-breed"]}`;
        savedMatchesList.appendChild(matchItem);

        // getNextMatch();
    };

    const handleNoThanks = () => {};

    return (
        <div id="matchups-container">
            <div id="no-match-message"></div>
            <div id="match-profile">
                <img
                    id="match-profile-pic"
                    className="match-profile-pic"
                    src={currMatchPetImage}
                    alt="match"
                    draggable="false"
                />
                <div id="match-pet-name">{currMatchProfile["pet-name"]}</div>
                <div id="match-pet-breed">{currMatchProfile["pet-breed"]}</div>
                <div id="match-pet-duration">
                    {currMatchDuration !== "1 min"
                        ? `You're approx ${currMatchDuration} apart!`
                        : "You're in the same city!"}
                </div>
            </div>
            <div>
                <Button variant="info" id="about-match-button" onClick={handleAboutMatch}>
                    About Match
                </Button>
                <Button variant="info" onClick={handleSaveMatch} id="save-match-button">
                    Save Match
                </Button>
                <Button variant="info" onClick={handleNoThanks} id="no-thanks-button">
                    No Thanks
                </Button>
            </div>
            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                <Container id="profile-container">
                    <Row id="profile-row">
                        <Col className="profile-left match-profile-left">
                            <figure>
                                <img
                                    className="profile-pic"
                                    alt="pet profile"
                                    draggable="false"
                                    src={currMatchPetImage}
                                />
                                <figcaption id="popup-match-pet-name">
                                    {currMatchProfile["pet-name"]}
                                </figcaption>
                            </figure>

                            <figure>
                                <img
                                    className="profile-pic"
                                    alt="owner profile"
                                    draggable="false"
                                    src={currMatchOwnerImage}
                                />
                                <figcaption id="popup-match-owner-name">
                                    {currMatchProfile["owner-name"]}
                                </figcaption>
                            </figure>
                        </Col>
                        <Col className="profile-middle match-profile-middle">
                            <Row className="pet-info match-pet-info">
                                <header className="panel-title">About the Pet</header>
                                <div>
                                    <img src={breed} draggable="false" alt="pet breed" />
                                    <span>{currMatchProfile["pet-breed"]}</span>
                                </div>
                                <div>
                                    <img src={bday} draggable="false" alt="pet birthday" />
                                    <span>{currMatchProfile["pet-bday"]}</span>
                                </div>
                                <div>
                                    <img src={weight} draggable="false" alt="pet weight" />
                                    <span>{currMatchProfile["pet-weight"]} pounds</span>
                                </div>
                            </Row>
                            <Row className="owner-info match-owner-info">
                                <header className="panel-title">About the Owner</header>
                                <div>
                                    <img src={email} draggable="false" alt="owner email" />
                                    <span>{currMatchProfile["owner-email"]}</span>
                                </div>
                                <div>
                                    <img src={home} draggable="false" alt="owner state" />
                                    <span>
                                        {currMatchProfile["owner-city"]},{" "}
                                        {currMatchProfile["owner-state"]}
                                    </span>
                                </div>
                            </Row>
                        </Col>
                        <Col className="profile-right match-profile-right">
                            <Row className="pet-metrics match-pet-metrics">
                                <header className="panel-title">Pet Traits</header>
                                <div className="pet-trait">Energy Level</div>
                                <ReactStars
                                    value={parseFloat(currMatchQualities.traits["energy-level"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Dog-Friendly</div>
                                <ReactStars
                                    value={parseFloat(currMatchQualities.traits["dog-friendly"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">People-Friendly</div>
                                <ReactStars
                                    value={parseFloat(currMatchQualities.traits["people-friendly"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Tendency to Bark</div>
                                <ReactStars
                                    value={parseFloat(
                                        currMatchQualities.traits["tendency-to-bark"]
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
                                    <div>{currMatchQualities.interests}</div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Popup>
            <div id="saved-matches-container">
                <div>Saved Matches (w/ buttons below)</div>
                <ul id="saved-matches-list"></ul>
            </div>
        </div>
    );
}
