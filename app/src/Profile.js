import ImageUploader from "react-images-upload";
import axios from "axios";
import { server } from "./App";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let profile = localStorage.getItem("profile");

    const onUpload = (picture) => {
        console.log(picture[0]);
        const profilePic = new FormData();
        profilePic.append('file', picture[0]);

        axios.post(`${server}update_picture`, profilePic).then(
            (res) => {
                console.log('success')
                // localStorage.setItem("isLoggedIn", true);
                // localStorage.setItem("profile", JSON.stringify(res.data));
                // localStorage.setItem("username", JSON.stringify(res.data["username"]));
                // localStorage.setItem("password", JSON.stringify(res.data["password"]));
                // history.push(paths.home);
            },
            (error) => {
                console.log('failure')
                // usernameStatus.innerHTML = "";
                // setDangerStatus(passwordStatus, "Invalid username and/or password!");
            }
        );
    };

    return (
        <div id="profile">
            <ImageUploader
                withIcon={false}
                buttonText="Choose images"
                onChange={onUpload}
                imgExtension={[".jpg", ".png"]}
                maxFileSize={10000000}
                label="Max file size: 10MB, Accepted: .jpg, .png"
                singleImage={true}
            />
            <div>{profile}</div>
        </div>
    );
}
