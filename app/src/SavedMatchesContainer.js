import Button from "react-bootstrap/Button";

export function SavedMatchesContainer(props) {
    return (
        <div id="saved-matches-container">
            <div>Saved Matches</div>
            <ul id="saved-matches-list">
                {Object.keys(props.savedMatches).map((username) => (
                    <li key={username} data-li-match-username={username}>
                        <span
                            className="saved-match-item"
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
            <Button
                variant="info"
                onClick={props.handleEditSavedMatches}
                id="edit-saved-matches-match-button"
            >
                Edit Saved Matches
            </Button>
            <Button
                variant="info"
                onClick={props.handleDoneEditing}
                id="done-editing-match-button"
                style={{ display: "none" }}
            >
                Done Editing
            </Button>
        </div>
    );
}
