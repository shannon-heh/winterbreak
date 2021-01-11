import Button from "react-bootstrap/Button";
import Popup from "reactjs-popup";

export function SearchPetsContainer(props) {
    return (
        <>
            <Button variant="info" onClick={props.handleSearchAllPets} id="search-all-pets-match-button">
                Search All Pets
            </Button>
            <Popup
                open={props.open}
                closeOnDocumentClick
                onClose={props.close}
            >
                <div id="search-all-pets">
                    <input
                        type="text"
                        value={props.searchTerm}
                        onChange={props.editSearchTerm}
                        placeholder="Start discovering!"
                    />
                    <ul id="all-pets-list">
                        {props.searchForPets().map((pet) => (
                            <li key={pet.username} data-li-search-username={pet.username}>
                                {pet.query}
                                <button
                                    onClick={props.handleSaveSearchedPet}
                                    data-search-username={pet.username}
                                    data-pet-info={pet.info}
                                    disabled={pet.isSaved}
                                >
                                    {pet.isSaved ? "Already saved!" : "Save pet!"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Popup>
        </>
    );
}