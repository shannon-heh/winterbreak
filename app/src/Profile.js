import { useHistory } from "react-router-dom";
import ImageUploader from "react-images-upload";
import axios from "axios";
import { useEffect, useState } from "react";
import { server, paths } from "./App";
import Button from "react-bootstrap/Button";
import ReactStars from "react-rating-stars-component";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let history = useHistory();

    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    let profile = JSON.parse(localStorage.getItem("profile"));

    let [isImageUploaded, setImageUploaded] = useState(false);
    let imagesToLoad = ["pet", "owner"];
    const maxImageSize = 8388608;

    /* fetches and renders pet and owner pictures upon page load and/or new picture upload */
    useEffect(() => {
        paths.current = paths.profile;
        document.title = "Profile";

        imagesToLoad.forEach((image_type) => {
            const image = { username: username, password: password, image_type: image_type };

            axios.post(`${server}get_picture`, image).then(
                (res) => {
                    document.getElementById(
                        `${image_type}-image`
                    ).src = `data:image/png;base64,${res.data}`;
                },
                (error) => {}
            );
        });
    });

    /* uploads and replaces a new pet or owner picture */
    const doUpload = (image_type, image) => {
        const profilePic = new FormData();
        profilePic.append("file", image);
        profilePic.append("username", username);
        profilePic.append("password", password);
        profilePic.append("image_type", image_type);

        axios.post(`${server}update_picture`, profilePic).then(
            (res) => {
                imagesToLoad = [image_type];
                setImageUploaded(!isImageUploaded);
            },
            (error) => {}
        );
    };

    /* new pet picture upload */
    const handlePetUpload = (picture) => {
        doUpload("pet", picture[0]);
    };

    /* new owner picture upload */
    const handleOwnerUpload = (picture) => {
        doUpload("owner", picture[0]);
    };

    const handleEditProfile = (event) => {
        history.push(paths.edit_profile)
    }

    const handleEnergyRating = (event) => {
        console.log(event) /* number of stars */
    }

    const handleDogFriendlyRating = (event) => {
        console.log(event) /* number of stars */
    }

    const handlePeopleFriendlyRating = (event) => {
        console.log(event) /* number of stars */
    }

    const handleBarkRating = (event) => {
        console.log(event) /* number of stars */
    }

    return (
        <Container id="profile-container">
            <Row id="profile-row">
                <Col id="profile-left">
                    <figure>
                        <img id="pet-image" className="profile-pic" src="" alt="Pet Profile"/>
                        <figcaption>{profile['pet-name']}</figcaption>
                    </figure>

                    {/* <ImageUploader
                        id="pet-uploader"
                        withIcon={false}
                        buttonText="Choose Pet's Image"
                        onChange={handlePetUpload}
                        imgExtension={[".jpg", ".jpeg", ".png"]}
                        maxFileSize={maxImageSize}
                        label="Upload new pet picture (.jpg, .jpeg, .png - max 8MB)"
                        singleImage={true}
                    /> */}

                    <figure>
                        <img id="owner-image" className="profile-pic" src="" alt="Owner Profile" />
                        <figcaption>{profile['owner-name']}</figcaption>
                    </figure>

                    {/* <ImageUploader
                        id="owner-uploader"
                        withIcon={false}
                        buttonText="Choose Owner's Image"
                        onChange={handleOwnerUpload}
                        imgExtension={[".jpg", ".jpeg", ".png"]}
                        maxFileSize={maxImageSize}
                        label="Upload new owner picture (.jpg, .jpeg, .png - max 8MB)"
                        singleImage={true}
                    /> */}
                    <Button variant="info" id="edit-profile" onClick={handleEditProfile}>
                        Edit Profile
                    </Button>
                    {/* <button onClick={handleEditProfile}>Edit Profile</button> */}
                </Col>
                <Col id="profile-middle">
                    <Row id="pet-info">
                        <div>About the Pet</div>
                        <div>
                            {profile['pet-breed']}
                        </div>
                        <div>
                            {profile['pet-bday']}
                        </div>
                        <div>
                            {profile['pet-weight']} pounds
                        </div>
                    </Row>
                    <Row id="owner-info">
                        <div>About the Owner</div>
                        <div>
                            {profile['owner-email']}
                        </div>
                        <div>
                            {profile['owner-city']}, {profile['owner-state']}
                        </div>
                    </Row>
                </Col>
                <Col id="profile-right">
                    <Row id="pet-metrics">
                    <div>Energy Level</div>
                    <ReactStars
                        count={5}
                        size={24}
                        value={1}
                        onChange={handleEnergyRating}
                        activeColor="#ffd700"
                    />
                    <div>Dog-Friendly</div>
                    <ReactStars
                        count={5}
                        size={24}
                        value={1}
                        onChange={handleDogFriendlyRating}
                        activeColor="#ffd700"
                    />
                    <div>People-Friendly</div>
                    <ReactStars
                        count={5}
                        size={24}
                        value={1}
                        onChange={handlePeopleFriendlyRating}
                        activeColor="#ffd700"
                    />
                    <div>Tendency to Bark</div>
                    <ReactStars
                        count={5}
                        size={24}
                        value={1}
                        onChange={handleBarkRating}
                        activeColor="#ffd700"
                    />

                    <div>Interests</div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
