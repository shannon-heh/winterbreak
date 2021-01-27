import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

export function RandomImage() {
    /* changes the header loading text to "Doggy Pic!" and removes spinner */
    const disableLoadingText = () => {
        try {
            document.getElementById("random-image-loading-text").innerHTML = "Doggy Pic!";
        } catch (error) {
            console.log(error);
        }
    };

    axios.get("https://api.thedogapi.com/v1/images/search?size=small").then(
        (res) => {
            disableLoadingText();
            document.getElementById("random-image").src = res.data[0]["url"];
            document.getElementById("random-image").ondragstart = function () {
                return false;
            };
        },
        (error) => {}
    );

    return (
        <div>
            <div id="random-image-loading-text">
                Loading...{" "}
                <Spinner
                    id="map-loading-spinner"
                    animation="grow"
                    variant="warning"
                    size="md"
                    style={{ display: "inline-block", color: "#c88719 !important" }}
                />
            </div>
            <img id="random-image" />
        </div>
    );
}
