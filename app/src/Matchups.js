import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "./App";
import { MatchPopup } from "./MatchPopup";
import { SavedMatchesContainer } from "./SavedMatchesContainer";
import { SearchPetsPopup } from "./SearchPetsPopup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "reactjs-popup/dist/index.css";
import aboutMatch from "./images/about-match.svg";
import saveMatch from "./images/save-match.svg";
import noThanks from "./images/no-thanks.svg";

export function Matchups() {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");

    /* hooks for about popup */
    const [openAboutMatchPopup, setOpenAboutMatchPopup] = useState(false);
    const closeAboutMatchPopup = () => setOpenAboutMatchPopup(false);

    /* hooks for saved match popup */
    const [openSavedMatchPopup, setOpenSavedMatchPopup] = useState(false);
    const closeSavedMatchPopup = () => setOpenSavedMatchPopup(false);

    /* hooks for search all pets popup */
    const [openSearchAllPetsPopup, setSearchAllPetsPopup] = useState(false);
    const closeSearchAllPetsPopup = () => setSearchAllPetsPopup(false);

    /* hooks for search pets functionality */
    const [allPetQueries, setAllPetQueries] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    /* hook for saved match edit mode */
    const [inEditMode, setInEditMode] = useState(false);

    /* hook to keep track of currently-saved matches */
    const [savedMatches, setSavedMatches] = useState({});

    /* hooks for current match information */
    const [currMatchUsername, setCurrMatchUsername] = useState("");
    const [currMatchProfile, setCurrMatchProfile] = useState({ traits: {} });
    const [currMatchPetImage, setCurrMatchPetImage] = useState("");
    const [currMatchOwnerImage, setCurrMatchOwnerImage] = useState("");

    /* hooks for saved match information */
    const [savedMatchProfile, setSavedMatchProfile] = useState({ traits: {} });
    const [savedMatchPetImage, setSavedMatchPetImage] = useState("");
    const [savedMatchOwnerImage, setSavedMatchOwnerImage] = useState("");

    /*************** POINTER/CLICK UI FUNCTIONALITY ***************/
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
    };

    /* disable all match buttons (wrapper) */
    const disableAllMatchButtons = (cursor) => {
        disableMatchButton("about", cursor);
        disableMatchButton("save", cursor);
        disableMatchButton("no-thanks", cursor);
    };

    /* enable all user clicks */
    const enableClicks = () => {
        document.getElementById("root").style["pointer-events"] = "auto";
    };

    /* disable all user clicks (needed during backend calls to prevent DOM corruption) */
    const disableClicks = () => {
        document.getElementById("root").style["pointer-events"] = "none";
    };

    /*************** HANDLE NEXT/SAVED MATCHES FUNCTIONALITY ***************/
    /* fetches next best match for user and the match's profile information. 
    displays key information about match. loads full profile information 
    into pop-up (pop-up appears when user clicks About Match button). 
    
    if no matches can be displayed (i.e. all matches saved or only 1 user), 
    display messsage and disable all buttons.

    if all possible matches have either been saved or ignored,
    display alert and start over with next best match.
    */
    const getNextMatch = () => {
        disableAllMatchButtons("progress");
        disableMatchButton("edit-saved-matches", "progress");
        disableMatchButton("search-all-pets", "progress");
        disableClicks();

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
                    window.alert(
                        "All potential matches have now either been saved or ignored.\nLet's revisit matches you haven't yet saved!\nNote that you may see matches you've seen before."
                    );

                const matchUsername = res.data["username"];
                setCurrMatchUsername(matchUsername);

                const matchPetImage = {
                    username: username,
                    password: password,
                    image_type: "pet",
                    match_username: matchUsername,
                };

                const matchOwnerImage = {
                    username: username,
                    password: password,
                    image_type: "owner",
                    match_username: matchUsername,
                };

                const credentials = {
                    username: username,
                    password: password,
                    match_username: matchUsername,
                };

                axios
                    .all([
                        axios.post(`${server}get_picture`, matchPetImage),
                        axios.post(`${server}get_picture`, matchOwnerImage),
                        axios.post(`${server}get_match_profile`, credentials),
                    ])
                    .then(
                        (res) => {
                            setCurrMatchPetImage(`data:image/png;base64,${res[0].data}`);
                            setCurrMatchOwnerImage(`data:image/png;base64,${res[1].data}`);
                            setCurrMatchProfile(res[2].data);
                            enableAllMatchButtons();
                            enableMatchButton("edit-saved-matches");
                            enableMatchButton("search-all-pets");
                            enableClicks();
                        },
                        (error) => {}
                    );
            },
            (error) => {
                if (error.response.status === 404) {
                    document.getElementById("match-profile").style.display = "none";
                    document.getElementById("no-match-message").innerHTML =
                        "No more matches - check back later!";
                    disableAllMatchButtons("not-allowed");
                    enableMatchButton("edit-saved-matches");
                    enableMatchButton("search-all-pets");
                    enableClicks();
                }
            }
        );
    };

    /* fetch list of saved matches for current user and displays each match's name and breed */
    const getSavedMatches = () => {
        const credentials = {
            username: username,
            password: password,
        };

        axios.post(`${server}get_saved_matches`, credentials).then(
            (res) => {
                const matches = res.data;
                const temp = {};

                Object.keys(matches).forEach((username) => {
                    const match = matches[username];
                    temp[username] = `${match["pet-name"]}, ${match["pet-breed"]}`;
                });

                setSavedMatches(temp);
            },
            (error) => {}
        );
    };

    /*************** HANDLE MATCHUP BUTTON FUNCTIONALITY ***************/
    /* when About Match button is clicked, re-render componnt */
    const handleAboutMatch = () => {
        setOpenAboutMatchPopup((o) => !o);
    };

    /* when Save Match button is clicked, save the current match,
    append this match under saved matches list, 
    and display next match */
    const handleSaveMatch = () => {
        disableClicks();
        disableAllMatchButtons("not-allowed");

        const credentials = {
            username: username,
            password: password,
            match_username: currMatchProfile["username"],
            action: "save",
        };

        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                const temp = JSON.parse(JSON.stringify(savedMatches));
                temp[
                    currMatchProfile["username"]
                ] = `${currMatchProfile["pet-name"]}, ${currMatchProfile["pet-breed"]}`;
                setSavedMatches(temp);

                getNextMatch();
            },
            (error) => {}
        );
    };

    /* when No Thanks button is clicked, ignore the current match 
    and display next match */
    const handleNoThanks = () => {
        disableClicks();
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

    /*************** HANDLE SAVED MATCHES FUNCTIONALITY ***************/
    /* when user clicks on a saved match, displays popup with match's profile information */
    const handleAboutSavedMatch = (event) => {
        disableClicks();

        const savedMatchUsername = event.target.getAttribute("data-span-match-username");

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

        axios
            .all([
                axios.post(`${server}get_picture`, matchPetImage),
                axios.post(`${server}get_picture`, matchOwnerImage),
                axios.post(`${server}get_match_profile`, credentials),
            ])
            .then((res) => {
                setSavedMatchPetImage(`data:image/png;base64,${res[0].data}`);
                setSavedMatchOwnerImage(`data:image/png;base64,${res[1].data}`);
                setSavedMatchProfile(res[2].data);
                enableAllMatchButtons();
                enableMatchButton("edit-saved-matches");
                enableClicks();
                setOpenSavedMatchPopup((o) => !o);
            });
    };

    /* when user clicks on Edit Saved Matches button, displays Delete buttons 
    next to each saved match and prevents match profile from being displayed */
    const handleEditSavedMatches = () => {
        disableClicks();
        setInEditMode(!inEditMode);
        disableAllMatchButtons("not-allowed");
        disableMatchButton("search-all-pets", "not-allowed");

        document.getElementById("edit-saved-matches-match-button").style.display = "none";
        document.getElementById("done-editing-match-button").style.display = "inline-block";

        for (let button of document.getElementsByClassName("saved-match-delete"))
            button.style.display = "inline-block";

        for (let item of document.getElementsByClassName("saved-match-item"))
            item.style.cursor = "default";

        enableClicks();
    };

    /* when user clicks delete on a saved match, moves this match to their ignored matches 
    and updates list of saved matches */
    const handleDeleteMatch = (event) => {
        disableClicks();
        const match_username = event.target.getAttribute("data-button-match-username");

        const credentials = {
            username: username,
            password: password,
            match_username: match_username,
            action: "ignore",
        };

        // move match_username from saved to ignored
        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                const temp = JSON.parse(JSON.stringify(savedMatches));
                delete temp[match_username];
                setSavedMatches(temp);
            },
            (error) => {}
        );
    };

    /* when user clicks on Done Editing button, removes all Delete buttons and 
    sets all matches back to clickable */
    const handleDoneEditing = () => {
        disableClicks();
        setInEditMode(!inEditMode);
        document.getElementById("edit-saved-matches-match-button").style.display = "inline-block";
        document.getElementById("done-editing-match-button").style.display = "none";

        for (let button of document.getElementsByClassName("saved-match-delete"))
            button.style.display = "none";

        for (let item of document.getElementsByClassName("saved-match-item"))
            item.style.cursor = "pointer";

        getNextMatch();
    };

    /*************** HANDLE SEARCH PETS FUNCTIONALITY ***************/
    /* in search popup, when user clicks Save on a searched pet, 
    updates list of saved matches */
    const handleSaveSearchedPet = (event) => {
        disableClicks();

        const matchUsername = event.target.getAttribute("data-search-username");
        const matchPetInfo = event.target.getAttribute("data-pet-info");

        const credentials = {
            username: username,
            password: password,
            match_username: matchUsername,
            action: "save",
        };

        axios.post(`${server}update_match_status`, credentials).then(
            (res) => {
                const temp = JSON.parse(JSON.stringify(savedMatches));
                temp[matchUsername] = matchPetInfo;
                setSavedMatches(temp);

                /* if user saves currently displayed match */
                if (matchUsername === currMatchUsername) getNextMatch();
                enableClicks();
            },
            (error) => {}
        );
    };

    /* when user clicks Search All Pets, fetches pet queries for all users and displays them in popup */
    const handleSearchAllPets = () => {
        disableClicks();
        const credentials = {
            username: username,
            password: password,
        };

        axios.post(`${server}get_all_pet_search_terms`, credentials).then(
            (res) => {
                setAllPetQueries(res.data);
                setSearchAllPetsPopup((o) => !o);
                enableClicks();
            },
            (error) => {}
        );
    };

    /* when user edits entered search query, updates hook */
    const editSearchTerm = (event) => {
        setSearchTerm(event.target.value);
    };

    /* dynamically updates list of displayed pets in search popup shows pets 
    whose name, breed, city, or state are prefixed by user's search query */
    const searchForPets = () => {
        const res = [];

        Object.keys(allPetQueries).forEach((username) => {
            let petQuery = allPetQueries[username];
            let searchTermLow = searchTerm.toLowerCase();
            let petSubqueries = petQuery.split(" — ");

            let petName = petSubqueries[0];
            let petBreed = petSubqueries[1];
            let ownerCity = petSubqueries[2];
            let ownerState = petSubqueries[3];

            if (
                petName.toLowerCase().startsWith(searchTermLow) ||
                petBreed.toLowerCase().startsWith(searchTermLow) ||
                ownerCity.toLowerCase().startsWith(searchTermLow) ||
                ownerState.toLowerCase().startsWith(searchTermLow)
            )
                res.push({
                    username: username,
                    query: petQuery,
                    info: `${petName}, ${petBreed}`,
                    isSaved: savedMatches.hasOwnProperty(username),
                });
        });

        return res;
    };

    /* called upon first render */
    useEffect(() => {
        getNextMatch();
        getSavedMatches();
    }, []);

    useEffect(() => {
        enableClicks();
    }, [savedMatches]);

    useEffect(() => {}, [
        currMatchPetImage,
        currMatchOwnerImage,
        currMatchProfile,
        savedMatchPetImage,
        savedMatchOwnerImage,
        savedMatchProfile,
    ]);

    return (
        <Row id="matchups-container">
            <Col id="matchups-match-column" className="col-4">
                <div id="no-match-message"></div>
                <div id="match-profile">
                    <img
                        id="match-profile-pic"
                        className="match-profile-pic"
                        src={currMatchPetImage}
                        alt="match"
                        draggable="false"
                    />
                    <div id="match-pet-name" className="match-pet-info">
                        {currMatchProfile["pet-name"]}
                    </div>
                    <div id="match-pet-breed" className="match-pet-info">
                        The {currMatchProfile["pet-breed"]}
                    </div>
                    <div id="match-pet-duration" className="match-pet-info">
                        {currMatchProfile["duration"] !== "1 min"
                            ? `You're approx ${currMatchProfile["duration"]} apart!`
                            : "You're in the same city!"}
                    </div>
                </div>
            </Col>
            <Col id="matchups-buttons-column" className="col-3">
                <Row>
                    <img src={aboutMatch} draggable="false" alt="about match" />
                </Row>
                <Row>
                    <Button
                        variant="info"
                        id="about-match-button"
                        onClick={handleAboutMatch}
                        className="single-match-button"
                    >
                        About Match
                    </Button>
                </Row>
                <Row>
                    <img src={saveMatch} draggable="false" alt="save match" />
                </Row>
                <Row>
                    <Button
                        variant="info"
                        onClick={handleSaveMatch}
                        id="save-match-button"
                        className="single-match-button"
                    >
                        Save Match
                    </Button>
                </Row>
                <Row>
                    <img src={noThanks} draggable="false" alt="no thanks" />
                </Row>
                <Row>
                    <Button
                        variant="info"
                        onClick={handleNoThanks}
                        id="no-thanks-match-button"
                        className="single-match-button"
                    >
                        No Thanks
                    </Button>
                </Row>
            </Col>
            <SavedMatchesContainer
                savedMatches={savedMatches}
                inEditMode={inEditMode}
                handleAboutSavedMatch={handleAboutSavedMatch}
                handleDeleteMatch={handleDeleteMatch}
                handleEditSavedMatches={handleEditSavedMatches}
                handleDoneEditing={handleDoneEditing}
                handleSearchAllPets={handleSearchAllPets}
            />
            <MatchPopup
                profile={currMatchProfile}
                petImage={currMatchPetImage}
                ownerImage={currMatchOwnerImage}
                open={openAboutMatchPopup}
                close={closeAboutMatchPopup}
            />
            <MatchPopup
                profile={savedMatchProfile}
                petImage={savedMatchPetImage}
                ownerImage={savedMatchOwnerImage}
                open={openSavedMatchPopup}
                close={closeSavedMatchPopup}
            />
            <SearchPetsPopup
                open={openSearchAllPetsPopup}
                close={closeSearchAllPetsPopup}
                searchTerm={searchTerm}
                editSearchTerm={editSearchTerm}
                searchForPets={searchForPets}
                handleSaveSearchedPet={handleSaveSearchedPet}
            />
        </Row>
    );
}
