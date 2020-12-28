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
export function EditProfile() {
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

    const inputFields = [
        "pet-name",
        "pet-bday",
        "pet-breed",
        "pet-weight",
        "owner-name",
        "owner-email",
        "owner-city",
        "owner-state"
    ]

    /* fetches and renders pet and owner pictures upon page load and/or new picture upload */
    useEffect(() => {
        paths.current = paths.edit_profile;
        document.title = "Edit Profile";

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

    const handleDoneEditing = (event) => {
        let profile = {};
        profile["username"] = username;
        profile["password"] = password;
        
        inputFields.forEach((input) => {
            profile[input] = document.getElementById(`${input}-input`).value
        });
        
        localStorage.setItem("profile", JSON.stringify(profile));
        
        axios.post(`${server}update_profile`, profile).then(
            (res) => {},
            (error) => {}
        );

        history.push(paths.profile);
    };

    const handleRatingChange = (trait, rating) => {
        let params = {
            username: username, 
            password: password,
            traits_or_interests: trait,
            trait_rating_or_interests: rating
        }

        axios.post(`${server}update_qualities`, params).then(
            (res) => {
                qualities.traits[trait] = rating;
                localStorage.setItem("qualities", JSON.stringify(qualities));
            },
            (error) => {}
        );
    }

    const handleEnergyLevelRating = (event) => {
        handleRatingChange("energy-level", event)
    };

    const handleDogFriendlyRating = (event) => {
        handleRatingChange("dog-friendly", event)
    };

    const handlePeopleFriendlyRating = (event) => {
        handleRatingChange("people-friendly", event)
    };

    const handleTendencyToBarkRating = (event) => {
        handleRatingChange("tendency-to-bark", event)
    };

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
                        {/* <figcaption>{profile["pet-name"]}</figcaption> */}
                    </figure>
                    <input 
                        id="pet-name-input"
                        defaultValue={profile["pet-name"]}
                        placeholder="e.g. Lucky" style={{"text-align":"center"}}
                    />

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
                    </figure>
                    <input 
                        id="owner-name-input"
                        defaultValue={profile["owner-name"]}
                        placeholder="e.g. Jane Doe" style={{'text-align':'center'}}
                    />

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
                    <Button variant="info" id="edit-profile" onClick={handleDoneEditing}>
                        Done Editing
                    </Button>
                    {/* <button onClick={handleDoneEditing}>Edit Profile</button> */}
                </Col>
                <Col id="profile-middle">
                    <Row id="pet-info">
                        <div className="panel-title">About the Pet</div>
                        <div>
                            <img src={breed} draggable="false" />
                            <input 
                                id="pet-breed-input"
                                defaultValue={profile["pet-breed"]} 
                                placeholder="e.g. Golden Retriever"
                            />
                        </div>
                        <div>
                            <img src={bday} draggable="false" />
                            <input 
                                id="pet-bday-input"
                                type="month" 
                                defaultValue={profile["pet-bday"]}
                            />
                        </div>
                        <div>
                            <img src={weight} draggable="false" />
                            <input 
                                id="pet-weight-input"
                                type="number" 
                                defaultValue={profile["pet-weight"]} 
                                placeholder="In pounds"
                            />
                        </div>
                    </Row>
                    <Row id="owner-info">
                        <div className="panel-title">About the Owner</div>
                        <div>
                            <img src={email} draggable="false" />
                            <input 
                                id="owner-email-input"
                                type="email" 
                                defaultValue={profile["owner-email"]} 
                                placeholder="e.g. jane.doe@gmail.com"
                            />
                        </div>
                        <div>
                            <img src={home} draggable="false" />
                            <input 
                                id="owner-city-input" 
                                defaultValue={profile["owner-city"]} 
                                placeholder="e.g. Los Angeles"
                            />
                            <input 
                                id="owner-state-input" 
                                defaultValue={profile["owner-state"]} 
                                placeholder="e.g. CA"
                            />
                        </div>
                    </Row>
                </Col>
                <Col id="profile-right">
                    <Row id="pet-metrics">
                        <div className="panel-title">Pet Traits</div>
                        <div className="pet-trait">Energy Level</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["energy-level"]}
                            isHalf={true}
                            onChange={handleEnergyLevelRating}
                            activeColor={starColor}
                            edit={true}
                        />
                        <div className="pet-trait">Dog-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["dog-friendly"]}
                            isHalf={true}
                            onChange={handleDogFriendlyRating}
                            activeColor={starColor}
                            edit={true}
                        />
                        <div className="pet-trait">People-Friendly</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["people-friendly"]}
                            isHalf={true}
                            onChange={handlePeopleFriendlyRating}
                            activeColor={starColor}
                            edit={true}
                        />
                        <div className="pet-trait">Tendency to Bark</div>
                        <ReactStars
                            count={5}
                            size={starSize}
                            value={qualities.traits["tendency-to-bark"]}
                            isHalf={true}
                            onChange={handleTendencyToBarkRating}
                            activeColor={starColor}
                            edit={true}
                        />
                        <br />
                        <div className="panel-title">Pet Interests</div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
