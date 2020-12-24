import ImageUploader from "react-images-upload";
import axios from "axios";
import { useEffect } from "react";
import { server, paths } from "./App";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    let profile = JSON.parse(localStorage.getItem("profile"));
    let images = JSON.parse(localStorage.getItem("images"));

    useEffect(() => {
        paths.current = paths.profile;
        document.title = "Profile";
    }, []);

    const onUpload = (picture) => {
        const profilePic = new FormData();
        profilePic.append("file", picture[0]);
        profilePic.append("username", username);
        profilePic.append("password", password);
        profilePic.append("image_type", "pet");

        /* 
            we can't save images into localStorage because of the size limit in localStorage
            so i think we should use something that just fetches both the owner and pet images upon
            page load

            and when you update either of the profile pictures, we need to just make a GET request
            for the new image and update div holding it
        */

        // Array.from(profilePic.entries()).forEach((e) => console.log(e));

        // images.pet = picture[0];
        // console.log(images);
        // localStorage.setItem("images", JSON.stringify(images));

        axios.post(`${server}update_picture`, profilePic).then(
            (res) => {
                // history.push(paths.home);
            },
            (error) => {}
        );
    };

    return (
        <div id="profile">
            <ImageUploader
                withIcon={false}
                buttonText="Choose images"
                onChange={onUpload}
                imgExtension={[".jpg", ".jpeg", ".png"]}
                maxFileSize={80000000}
                label="Max image size: 8MB (.jpg, .jpeg, .png)"
                singleImage={true}
            />
            {/* <div>{username}</div>
            <div>{password}</div>
            <div>{profile}</div>
            <div>{imagestemp}</div> */}
        </div>
    );
}
