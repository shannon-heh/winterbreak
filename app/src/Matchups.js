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

    /* hooks for about popup */
    const [openAboutMatchPopup, setOpenAboutMatchPopup] = useState(false);
    const closeAboutMatchPopup = () => setOpenAboutMatchPopup(false);

    /* hooks for saved match popup */
    const [openSavedMatchPopup, setOpenSavedMatchPopup] = useState(false);
    const closeSavedMatchPopup = () => setOpenSavedMatchPopup(false);

    /* constants for ratings in popup */
    const starColor = "#80cbc4";
    const starSize = 15;

    /* hooks for current match information */
    let currMatchUsername = "";
    const [currMatchDuration, setCurrMatchDuration] = useState("");
    const [currMatchProfile, setCurrMatchProfile] = useState({});
    const [currMatchQualities, setCurrMatchQualities] = useState({ traits: {} });
    const [currMatchPetImage, setCurrMatchPetImage] = useState("");
    const [currMatchOwnerImage, setCurrMatchOwnerImage] = useState("");

    /* hooks for saved match information */
    let savedMatchUsername = "";
    const [savedMatchDuration, setSavedMatchDuration] = useState("");
    const [savedMatchProfile, setSavedMatchProfile] = useState({});
    const [savedMatchQualities, setSavedMatchQualities] = useState({ traits: {} });
    const [savedMatchPetImage, setSavedMatchPetImage] = useState("");
    const [savedMatchOwnerImage, setSavedMatchOwnerImage] = useState("");

    /* enable a match button */
    const enableMatchButton = (name) => {
        const id = `${name}-match-button`;
        document.getElementById(id).disabled = false;
        document.getElementById(id).style.cursor = "pointer";
    };

    /* disable a match button */
    const disableMatchButton = (name, cursor) => {
        const id = `${name}-match-button`;
        document.getElementById(id).disabled = true;
        document.getElementById(id).style.cursor = cursor;
    };

    /* enable all match buttons (wrapper) */
    const enableAllMatchButtons = () => {
        enableMatchButton("about");
        enableMatchButton("save");
        enableMatchButton("no-thanks");
    }

    /* disable all match buttons (wrapper) */
    const disableAllMatchButtons = (cursor) => {
        disableMatchButton("about", cursor);
        disableMatchButton("save", cursor);
        disableMatchButton("no-thanks", cursor);
    }

    /* fetches next best match for user and the match's profile information.
    displays key information about match.
    loads full profile information into pop-up (pop-up appears when user 
    clicks About Match button). 
    
    if no matches can be displayed (i.e. all matches saved or only 1 user), 
    display messsage and disable all buttons.

    if all possible matches have either been saved or ignored,
    display alert and start over with next best match.
    */
    const getNextMatch = () => {
        disableAllMatchButtons("progress");
        disableMatchButton("edit-saved-matches", "progress");

        const credentials = {
            username: username,
            password: password,
        };

        axios.post(`${server}get_next_match`, credentials).then(
            (res) => {
                document.getElementById("match-profile").style.display = "inline-block";
                document.getElementById("no-match-message").innerHTML = "";
                
                // all possible matches have either been saved or ignored
                if (res.data["start_over"])
                    window.alert("All potential matches have now either been saved or ignored.\nLet's revisit matches you haven't yet saved!\nNote that you may see matches you've seen before.");

                currMatchUsername = res.data["username"];

                const matchPetImage = {
                    username: username,
                    password: password,
                    image_type: "pet",
                    match_username: currMatchUsername,
                };
        
                const matchOwnerImage = {
                    username: username,
                    password: password,
                    image_type: "owner",
                    match_username: currMatchUsername,
                };
        
                const credentials = {
                    username: username,
                    password: password,
                    match_username: currMatchUsername,
                };

                axios.all([
                    axios.post(`${server}get_picture`, matchPetImage),
                    axios.post(`${server}get_picture`, matchOwnerImage),
                    axios.post(`${server}get_match_profile`, credentials),
                    axios.post(`${server}get_qualities`, credentials)
                ]).then(
                    (res) => {
                        setCurrMatchPetImage(`data:image/png;base64,${res[0].data}`);
                        setCurrMatchOwnerImage(`data:image/png;base64,${res[1].data}`);
                        setCurrMatchProfile(res[2].data);
                        setCurrMatchDuration(res[2].data["duration"]);
                        setCurrMatchQualities(res[3].data);
                        enableAllMatchButtons();
                        enableMatchButton("edit-saved-matches", "progress");
                    },
                    (error) => {}
                )
            },
            (error) => {
                if (error.response.status === 404) {
                    document.getElementById("match-profile").style.display = "none";
                    document.getElementById("no-match-message").innerHTML = "No more matches - check back later!";
                    disableAllMatchButtons("not-allowed");
                    enableMatchButton("edit-saved-matches", "progress");
                }
            }
        );
    };

    const createMatchItem = (username, petNameAndBreed) => {
        const matchItem = document.createElement("LI");
        matchItem.id = `${username}-match-item`
        matchItem.className = "saved-match-item"
        matchItem.innerHTML = petNameAndBreed;
        matchItem.onclick = handleSavedMatchClick;
        matchItem.setAttribute("data-username", username);
        return matchItem;
    }

    /* creates delete button that appears next to each saved match 
    and appends it to DOM */
    const createMatchDeleteBtn = (username, matchItem) => {
        const matchDeleteBtn = document.createElement("BUTTON");
        matchDeleteBtn.className = "saved-match-delete"
        matchDeleteBtn.setAttribute('data-username', username);
        matchDeleteBtn.innerHTML = "×";
        matchDeleteBtn.style.display = "none";
        matchDeleteBtn.onclick = handleMatchDelete;
        matchItem.appendChild(matchDeleteBtn);
    }

    const handleMatchDelete = (event) => {
        const match_username = event.target.getAttribute('data-username')

        const credentials = {
            username: username,
            password: password,
            match_username: match_username,
            action: "ignore",
        };

        // move match_username from saved to ignored
        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {},
            (error) => {}
        );
        
         // remove match from saved list
         document.getElementById(`${match_username}-match-item`).remove();

    }

     /* fetch list of saved matches for current user 
     and displays each match's name and breec */
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
                    let matchItem = createMatchItem(username, `${matches[username]["pet-name"]}, ${matches[username]["pet-breed"]}`)
                    createMatchDeleteBtn(username,matchItem)
                    savedMatchesList.appendChild(matchItem);
                });
            },
            (error) => {}
        );
    };

    /* called upon first render */
    useEffect(() => {
        getNextMatch();
        getSavedMatches();
    }, []);

    useEffect(() => {}, [
        currMatchDuration,
        currMatchPetImage,
        currMatchOwnerImage,
        currMatchProfile,
        currMatchQualities,
        savedMatchDuration,
        savedMatchPetImage,
        savedMatchOwnerImage,
        savedMatchProfile,
        savedMatchQualities
    ]);

    /* when user clicks on a saved match,
    displays popup with match's profile information */
    const handleSavedMatchClick = (event) => {
        document.getElementById("root").style.cursor = "progress";
        
        const savedMatchUsername = event.target.getAttribute("data-username")

        const matchPetImage = {
            username: username,
            password: password,
            image_type: "pet",
            match_username: savedMatchUsername,
        };

        const matchOwnerImage = {
            username: username,
            password: password,
            image_type: "owner",
            match_username: savedMatchUsername,
        };

        const credentials = {
            username: username,
            password: password,
            match_username: savedMatchUsername,
        };

        axios.all([
            axios.post(`${server}get_picture`, matchPetImage),
            axios.post(`${server}get_picture`, matchOwnerImage),
            axios.post(`${server}get_match_profile`, credentials),
            axios.post(`${server}get_qualities`, credentials)
        ]).then(
            (res) => {
                setSavedMatchPetImage(`data:image/png;base64,${res[0].data}`);
                setSavedMatchOwnerImage(`data:image/png;base64,${res[1].data}`);
                setSavedMatchProfile(res[2].data);
                setSavedMatchDuration(res[2].data["duration"]);
                setSavedMatchQualities(res[3].data);
                enableAllMatchButtons();
                enableMatchButton("edit-saved-matches", "progress");
                document.getElementById("root").style.cursor = "default";
                setOpenSavedMatchPopup((o) => !o);
            }
        )
    }

    /* when About Match button is clicked, re-render componnt */
    const handleAboutMatch = () => {
        setOpenAboutMatchPopup((o) => !o);
    };

    /* when Save Match button is clicked, save the current match,
    append this match under saved matches list, 
    and display next match */
    const handleSaveMatch = () => {
        disableAllMatchButtons("not-allowed");

        const credentials = {
            username: username,
            password: password,
            match_username: currMatchProfile["username"],
            action: "save",
        };

        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                getNextMatch();
            },
            (error) => {}
        );

        /* add current match to saved matches list */
        const savedMatchesList = document.getElementById("saved-matches-list");
        const matchItem = createMatchItem(currMatchProfile["username"], `${currMatchProfile["pet-name"]}, ${currMatchProfile["pet-breed"]}`);
        createMatchDeleteBtn(currMatchProfile["username"],matchItem);
        savedMatchesList.appendChild(matchItem);
    };

    /* when No Thanks button is clicked, ignore the current match 
    and display next match */
    const handleNoThanks = () => {
        disableAllMatchButtons("not-allowed");

        const credentials = {
            username: username,
            password: password,
            match_username: currMatchProfile["username"],
            action: "ignore",
        };

        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                getNextMatch();
            },
            (error) => {}
        );
    };

    const handleEditSavedMatches = () => {
        disableAllMatchButtons("not-allowed");
        document.getElementById("edit-saved-matches-match-button").style.display = "none";
        document.getElementById("done-editing-match-button").style.display = "inline-block";

        for (let button of document.getElementsByClassName("saved-match-delete"))
            button.style.display = "inline-block";
            
        for (let item of document.getElementsByClassName("saved-match-item"))
            item.onclick = null;
    }

    const handleDoneEditing = () => {
        document.getElementById("edit-saved-matches-match-button").style.display = "inline-block";
        document.getElementById("done-editing-match-button").style.display = "none";

        for (let button of document.getElementsByClassName("saved-match-delete"))
            button.style.display = "none";

        for (let item of document.getElementsByClassName("saved-match-item"))
            item.onclick = handleSavedMatchClick;

        getNextMatch();
    }

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
                <Button variant="info" onClick={handleNoThanks} id="no-thanks-match-button">
                    No Thanks
                </Button>
            </div>
            <Popup open={openAboutMatchPopup} closeOnDocumentClick onClose={closeAboutMatchPopup}>
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

                            <div style={{"marginTop": "30px"}}>{currMatchDuration !== "1 min"
                                                                ? `You're approx ${currMatchDuration} apart!`
                                                                : "You're in the same city!"}</div>
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
            
            <Popup open={openSavedMatchPopup} closeOnDocumentClick onClose={closeSavedMatchPopup}>
                <Container id="profile-container">
                    <Row id="profile-row">
                        <Col className="profile-left match-profile-left">
                            <figure>
                                <img
                                    className="profile-pic"
                                    alt="pet profile"
                                    draggable="false"
                                    src={savedMatchPetImage}
                                />
                                <figcaption id="popup-match-pet-name">
                                    {savedMatchProfile["pet-name"]}
                                </figcaption>
                            </figure>

                            <figure>
                                <img
                                    className="profile-pic"
                                    alt="owner profile"
                                    draggable="false"
                                    src={savedMatchOwnerImage}
                                />
                                <figcaption id="popup-match-owner-name">
                                    {savedMatchProfile["owner-name"]}
                                </figcaption>
                            </figure>

                            <div style={{"margin-top": "30px"}}>{savedMatchDuration !== "1 min"
                                                                ? `You're approx ${savedMatchDuration} apart!`
                                                                : "You're in the same city!"}</div>
                        </Col>
                        <Col className="profile-middle match-profile-middle">
                            <Row className="pet-info match-pet-info">
                                <header className="panel-title">About the Pet</header>
                                <div>
                                    <img src={breed} draggable="false" alt="pet breed" />
                                    <span>{savedMatchProfile["pet-breed"]}</span>
                                </div>
                                <div>
                                    <img src={bday} draggable="false" alt="pet birthday" />
                                    <span>{savedMatchProfile["pet-bday"]}</span>
                                </div>
                                <div>
                                    <img src={weight} draggable="false" alt="pet weight" />
                                    <span>{savedMatchProfile["pet-weight"]} pounds</span>
                                </div>
                            </Row>
                            <Row className="owner-info match-owner-info">
                                <header className="panel-title">About the Owner</header>
                                <div>
                                    <img src={email} draggable="false" alt="owner email" />
                                    <span>{savedMatchProfile["owner-email"]}</span>
                                </div>
                                <div>
                                    <img src={home} draggable="false" alt="owner state" />
                                    <span>
                                        {savedMatchProfile["owner-city"]},{" "}
                                        {savedMatchProfile["owner-state"]}
                                    </span>
                                </div>
                            </Row>
                        </Col>
                        <Col className="profile-right match-profile-right">
                            <Row className="pet-metrics match-pet-metrics">
                                <header className="panel-title">Pet Traits</header>
                                <div className="pet-trait">Energy Level</div>
                                <ReactStars
                                    value={parseFloat(savedMatchQualities.traits["energy-level"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Dog-Friendly</div>
                                <ReactStars
                                    value={parseFloat(savedMatchQualities.traits["dog-friendly"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">People-Friendly</div>
                                <ReactStars
                                    value={parseFloat(savedMatchQualities.traits["people-friendly"])}
                                    count={5}
                                    size={starSize}
                                    isHalf={true}
                                    activeColor={starColor}
                                    edit={false}
                                />
                                <div className="pet-trait">Tendency to Bark</div>
                                <ReactStars
                                    value={parseFloat(
                                        savedMatchQualities.traits["tendency-to-bark"]
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
                                    <div>{savedMatchQualities.interests}</div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Popup>
            <div id="saved-matches-container">
                <div>Saved Matches</div>
                <ul id="saved-matches-list"></ul>
                <Button variant="info" onClick={handleEditSavedMatches} id="edit-saved-matches-match-button">
                    Edit Saved Matches
                </Button>
                <Button variant="info" onClick={handleDoneEditing} id="done-editing-match-button" style={{display: "none"}}>
                    Done Editing
                </Button>
            </div>
        </div>
    );
}
