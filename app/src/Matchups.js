import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "./App";
import Button from "react-bootstrap/Button";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

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

    let currMatchUsername = "";
    
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");

    const starColor = "#80cbc4";
    const starSize = 15;

    const getNextMatch = () => {
        const credentials = {
            username: username,
            password: password
        }

        axios.post(`${server}get_next_match`, credentials).then(
            (res) => {
                currMatchUsername = res.data["username"]

                const match_image = {
                    username: username,
                    password: password,
                    image_type: "pet",
                    match_username: currMatchUsername
                };

                document.getElementById("match-pet-name").innerHTML = res.data["pet-name"]
                document.getElementById("match-pet-breed").innerHTML = res.data["pet-breed"]

                if(res.data["distance"] === "1 ft" || res.data["duration"] === "1 min")
                    document.getElementById("match-pet-distance").innerHTML = "You're in the same city!"
                else 
                    document.getElementById("match-pet-distance").innerHTML = `You're about ${res.data["duration"]} apart!`

                axios.post(`${server}get_picture`, match_image).then(
                    (res) => {
                        document.getElementById("match-profile-pic").src = `data:image/png;base64,${res.data}`
                    },
                    (error) => {}
                );
            },
            (error) => {
                console.log(error);
            }
        );

    }
    
    useEffect(() => {
        getNextMatch();
    }, [getNextMatch]);

    const handleAboutMe = () => {
        const credentials = {
            username: username,
            password: password,
            match_username: currMatchUsername
        };

        axios.post(`${server}get_match_profile`, credentials).then(
            (res) => {
                console.log(res.data)
            },
            (error) => {}
        );
        
        const match_image = {
            username: username,
            password: password,
            image_type: "pet",
            match_username: currMatchUsername
        };

        console.log('fjijfd', currMatchUsername)
        
        axios.post(`${server}get_picture`, match_image).then(
            (res) => {
                document.getElementById("match-pet-image").src = `data:image/png;base64,${res.data}`
            },
            (error) => {}
        );

        match_image['image_type'] = "owner"

        axios.post(`${server}get_picture`, match_image).then(
            (res) => {
                document.getElementById("match-owner-image").src = `data:image/png;base64,${res.data}`
            },
            (error) => {}
        );

        setOpen(o => !o)
    }

    const handleSaveMe = () => {
        
    }

    const handleMaybeLater = () => {
        
    }

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    
    return (
        <div id="matchups-container">
            <div id="match-profile">
                <img
                    id="match-profile-pic"
                    className="match-profile-pic"
                    src=""
                    alt="match"
                    draggable="false"
                />
                <div id="match-pet-name"></div>
                <div id="match-pet-breed"></div>
                <div id="match-pet-distance"></div>
            </div>
            <div>
                <Button variant="info" id="match-about-me" onClick={handleAboutMe}>
                    About Me
                </Button>
                <Button variant="info" onClick={handleSaveMe} id="match-save-me">
                    Save Me!
                </Button>
                <Button variant="info" onClick={handleMaybeLater} id="match-maybe-later">
                    Maybe Later!
                </Button>
            </div>
            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                <Container id="profile-container">
                    <Row id="profile-row">
                        <Col className="profile-left match-profile-left">
                            <figure>
                                <img
                                    id="match-pet-image"
                                    className="profile-pic"
                                    // src={petImage}
                                    alt="pet profile"
                                    draggable="false"
                                />
                                <figcaption>Pet Name</figcaption>
                                {/* <figcaption>{profile["pet-name"]}</figcaption> */}
                            </figure>

                            <figure>
                                <img
                                    id="match-owner-image"
                                    className="profile-pic"
                                    // src={ownerImage}
                                    alt="owner profile"
                                    draggable="false"
                                />
                                <figcaption>Owner Name</figcaption>
                                {/* <figcaption>{profile["owner-name"]}</figcaption> */}
                            </figure>
                        </Col>
                        <Col className="profile-middle match-profile-middle">
                            <Row className="pet-info match-pet-info">
                                <header className="panel-title">About the Pet</header>
                                <div>
                                    <img src={breed} draggable="false" alt="pet breed" />
                                    <span>Golden retriever</span>
                                    {/* <span>{profile["pet-breed"]}</span> */}
                                </div>
                                <div>
                                    <img src={bday} draggable="false" alt="pet birthday" />
                                    <span>September 1543</span>
                                    {/* <span>{profile["pet-bday"]}</span> */}
                                </div>
                                <div>
                                    <img src={weight} draggable="false" alt="pet weight" />
                                    <span>93 kilos</span>
                                    {/* <span>{profile["pet-weight"]} pounds</span> */}
                                </div>
                            </Row>
                            <Row className="owner-info match-owner-info">
                                <header className="panel-title">About the Owner</header>
                                <div>
                                    <img src={email} draggable="false" alt="owner email" />
                                    <span>fuck@me.com</span>
                                    {/* <span>{profile["owner-email"]}</span> */}
                                </div>
                                <div>
                                    <img src={home} draggable="false" alt="owner state" />
                                    <span>Cum, QT</span>
                                    {/* <span>
                                        {profile["owner-city"]}, {profile["owner-state"]}
                                    </span> */}
                                </div>
                            </Row>
                        </Col>
                        <Col className="profile-right match-profile-right">
                            <Row className="pet-metrics match-pet-metrics">
                                <header className="panel-title">Pet Traits</header>
                                <div className="pet-trait">Energy Level</div>
                                <ReactStars
                                    count={5}
                                    size={starSize}
                                    // value={parseFloat(qualities.traits["energy-level"])}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Dog-Friendly</div>
                                <ReactStars
                                    count={5}
                                    size={starSize}
                                    // value={parseFloat(qualities.traits["dog-friendly"])}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">People-Friendly</div>
                                <ReactStars
                                    count={5}
                                    size={starSize}
                                    // value={parseFloat(qualities.traits["people-friendly"])}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Tendency to Bark</div>
                                <ReactStars
                                    count={5}
                                    size={starSize}
                                    // value={parseFloat(qualities.traits["tendency-to-bark"])}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <br />
                                <div className="pet-interests match-pet-interests">
                                    <header className="panel-title">Pet Interests</header>
                                    <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis p</div>
                                    {/* <div>{qualities["interests"]}</div> */}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Popup>
            <div>Saved Matches (w/ buttons below)</div>
        </div>
    );
}