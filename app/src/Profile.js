import ImageUploader from "react-images-upload";
import axios from "axios";
import { useEffect, useState } from "react";
import { server, paths } from "./App";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
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
                    console.log(res);
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
    const doPetUpload = (picture) => {
        doUpload("pet", picture[0]);
    };

    /* new owner picture upload */
    const doOwnerUpload = (picture) => {
        doUpload("owner", picture[0]);
    };

    return (
        <div id="profile">
            <figure>
                <img id="pet-image" src="" alt="Pet Profile Picture" />
                <figcaption>Pet Profile Picture</figcaption>
            </figure>

            <ImageUploader
                id="pet-uploader"
                withIcon={false}
                buttonText="Choose Pet's Image"
                onChange={doPetUpload}
                imgExtension={[".jpg", ".jpeg", ".png"]}
                maxFileSize={maxImageSize}
                label="Upload new pet picture (.jpg, .jpeg, .png - max 8MB)"
                singleImage={true}
            />

            <figure>
                <img id="owner-image" src="" alt="Owner Profile Picture" />
                <figcaption>Owner Profile Picture</figcaption>
            </figure>

            <ImageUploader
                id="owner-uploader"
                withIcon={false}
                buttonText="Choose Owner's Image"
                onChange={doOwnerUpload}
                imgExtension={[".jpg", ".jpeg", ".png"]}
                maxFileSize={maxImageSize}
                label="Upload new owner picture (.jpg, .jpeg, .png - max 8MB)"
                singleImage={true}
            />
        </div>
    );
}
