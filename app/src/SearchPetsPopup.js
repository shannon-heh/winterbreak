import Button from "react-bootstrap/Button";
import Popup from "reactjs-popup";

export function SearchPetsPopup(props) {
    return (
        <Popup open={props.open} closeOnDocumentClick onClose={props.close} className="search-pets">
            <div id="search-all-pets">
                <div id="search-pets-header">
                    <div id="search-pets-popup-title">
                        Enter a pet's name, breed, city, or state:
                    </div>
                    <input
                        id="search-pets-popup-input"
                        type="text"
                        value={props.searchTerm}
                        onChange={props.editSearchTerm}
                        placeholder="Start discovering!"
                    />
                </div>
                <div id="search-pets-content">
                    <ul id="all-pets-list">
                        {props.searchForPets().map((pet) => (
                            <li
                                key={pet.username}
                                data-li-search-username={pet.username}
                                className="search-pets-item"
                            >
                                {pet.query}
                                <Button
                                    className="search-pets-item-button"
                                    onClick={props.handleSaveSearchedPet}
                                    data-search-username={pet.username}
                                    data-pet-info={pet.info}
                                    style={{ cursor: pet.isSaved ? "not-allowed" : "pointer" }}
                                    disabled={pet.isSaved}
                                >
                                    {pet.isSaved ? "Saved" : "Save pet"}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Popup>
    );
}
