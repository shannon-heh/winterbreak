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
import breed from "./images/dog.svg";
import email from "./images/email.svg";
import home from "./images/home.svg";
import bday from "./images/birthday-cake.svg";
import weight from "./images/weight-scale.svg";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let history = useHistory();

    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    let profile = JSON.parse(localStorage.getItem("profile"));
    let qualities = JSON.parse(localStorage.getItem("qualities"))

    let [isImageUploaded, setImageUploaded] = useState(false);
    let imagesToLoad = ["pet", "owner"];
    const maxImageSize = 8388608;

    const starColor = "#80cbc4";
    const starSize = 20;

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
        history.push(paths.edit_profile);
    };

    const handleDeleteProfile = (event) => {
        // clear local storage 
        // delete entrise from backend
        // sign out 
    }

    return (
        <Container id="profile-container">
            <Row id="profile-row">
                <Col id="profile-left">
                    <figure>
                        <img
                            id="pet-image"
                            className="profile-pic"
                            src=""
                            alt="Pet Profile"
                            draggable="false"
                        />
                        <figcaption>{profile["pet-name"]}</figcaption>
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
                        <img
                            id="owner-image"
                            className="profile-pic"
                            src=""
                            alt="Owner Profile"
                            draggable="false"
                        />
                        <figcaption>{profile["owner-name"]}</figcaption>
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
                    <div id="profile-buttons">
                        <Button variant="info" id="edit-profile" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                        <Button variant="info" id="delete-profile" onClick={handleDeleteProfile}>
                            Delete Profile
                        </Button>
                    </div>
                    {/* <button onClick={handleEditProfile}>Edit Profile</button> */}
                </Col>
                <Col id="profile-middle">
                    <Row id="pet-info">
                        <header className="panel-title">About the Pet</header>
                        <div>
                            <img src={breed} draggable="false" />
                            <span>{profile["pet-breed"]}</span>
                        </div>
                        <div>
                            <img src={bday} draggable="false" />
                            <span>{profile["pet-bday"]}</span>
                        </div>
                        <div>
                            <img src={weight} draggable="false" />
                            <span>{profile["pet-weight"]} pounds</span>
                        </div>
                    </Row>
                    <Row id="owner-info">
                        <header className="panel-title">About the Owner</header>
                        <div>
                            <img src={email} draggable="false" />
                            <span>{profile["owner-email"]}</span>
                        </div>
                        <div>
                            <img src={home} draggable="false" />
                            <span>
                                {profile["owner-city"]}, {profile["owner-state"]}
                            </span>
                        </div>
                    </Row>
                </Col>
                <Col id="profile-right">
                    <Row id="pet-metrics">
                        <header className="panel-title">Pet Traits</header>
                        <div className="pet-trait">Energy Level</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["energy-level"]}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">Dog-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["dog-friendly"]}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">People-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["people-friendly"]}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <div className="pet-trait">Tendency to Bark</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["tendency-to-bark"]}
                            isHalf={true}
                            activeColor={starColor}
                            edit={false}
                        />
                        <br />
                        <div id="pet-interests">
                            <header className="panel-title">Pet Interests</header>
                            <div>{qualities["interests"]}</div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
