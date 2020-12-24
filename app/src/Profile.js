import ImageUploader from "react-images-upload";
import axios from "axios";
import { useEffect, useState } from "react";
import { server, paths } from "./App";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    let profile = JSON.parse(localStorage.getItem("profile"));
    let images = JSON.parse(localStorage.getItem("images"));

    let [isImageUploaded, setImageUploaded] = useState(false);
    let imagesToLoad = ['pet', 'owner'];

    useEffect(() => {
        paths.current = paths.profile;
        document.title = "Profile";

        imagesToLoad.forEach((image_type) => {
            const image = {'username': username, 'password': password, 'image_type': image_type}

            axios.post(`${server}get_picture`, image).then(
                (res) => {
                    console.log(res);
                    document.getElementById(`${image_type}-image`).src = `data:image/png;base64,${res.data}`;
                },
                (error) => {}
            );
        }); 
    });

    const onPetUpload = (picture) => {
        const profilePic = new FormData();
        profilePic.append("file", picture[0]);
        profilePic.append("username", username);
        profilePic.append("password", password);
        profilePic.append("image_type", "pet");

        axios.post(`${server}update_picture`, profilePic).then(
            (res) => {
                imagesToLoad = ["pet"];
                setImageUploaded(!isImageUploaded);
                // history.push(paths.home);
            },
            (error) => {}
        );
    };

    const onOwnerUpload = (picture) => {
        const profilePic = new FormData();
        profilePic.append("file", picture[0]);
        profilePic.append("username", username);
        profilePic.append("password", password);
        profilePic.append("image_type", "owner");

        axios.post(`${server}update_picture`, profilePic).then(
            (res) => {
                imagesToLoad = ["owner"];
                setImageUploaded(!isImageUploaded);
                // history.push(paths.home);
            },
            (error) => {}
        );
    };

    return (
        <div id="profile">
            <ImageUploader
                id="pet-uploader"
                withIcon={false}
                buttonText="Choose Pet's Image"
                onChange={onPetUpload}
                imgExtension={[".jpg", ".jpeg", ".png"]}
                maxFileSize={80000000}
                label="Upload new pet picture: max 8MB (.jpg, .jpeg, .png)"
                singleImage={true}
            />
            <ImageUploader
                id="owner-uploader"
                withIcon={false}
                buttonText="Choose Owner's Image"
                onChange={onOwnerUpload}
                imgExtension={[".jpg", ".jpeg", ".png"]}
                maxFileSize={80000000}
                label="Upload new owner picture: max 8MB (.jpg, .jpeg, .png)"
                singleImage={true}
            />
            <img id="pet-image" src="" />
            <img id="owner-image" src="" />
        </div>
    );
}
