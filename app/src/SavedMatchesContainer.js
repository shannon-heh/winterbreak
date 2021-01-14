import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function SavedMatchesContainer(props) {
    return (
        <Col id="matchups-saved-matches-column" className="col-5">
            <Row id="saved-matches-container">
                <div id="saved-matches-title">Saved Matches</div>
                <div id="saved-matches-list-container">
                    <ul id="saved-matches-list">
                        <li id="no-saved-matches-message">{Object.keys(props.savedMatches).length === 0 ? 
                            "You have no saved matches! Click About Match to learn more about the displayed pet, Save Match to add this pet to your list, or No Thanks to reconsider this pet at a later time."
                        : "" }</li>
                        {Object.keys(props.savedMatches).map((username) => (
                            <li
                                key={username}
                                data-li-match-username={username}
                                className="saved-match-item"
                            >
                                <span
                                    className="saved-match-span"
                                    data-span-match-username={username}
                                    onClick={props.inEditMode ? null : props.handleAboutSavedMatch}
                                >
                                    {props.savedMatches[username]}
                                </span>
                                <button
                                    className="saved-match-delete"
                                    onClick={props.handleDeleteMatch}
                                    data-button-match-username={username}
                                    style={{ display: "none" }}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Row>
            <Row>
                <Button
                    className="saved-matches-button"
                    variant="info"
                    onClick={props.handleEditSavedMatches}
                    id="edit-saved-matches-match-button"
                >
                    Edit Saved
                </Button>
                <Button
                    className="saved-matches-button"
                    variant="info"
                    onClick={props.handleDoneEditing}
                    id="done-editing-match-button"
                    style={{ display: "none" }}
                >
                    Done Editing
                </Button>
            </Row>
            <Row>
                <Button
                    className="saved-matches-button"
                    variant="info"
                    onClick={props.handleSearchAllPets}
                    id="search-all-pets-match-button"
                >
                    Search Pets
                </Button>
            </Row>
        </Col>
    );
}
