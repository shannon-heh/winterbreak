import ImageUploader from "react-images-upload";

/* Profile provides user profile functionality on /p/profile */
export function Profile() {
    let profile = localStorage.getItem("profile");

    const onUpload = (picture) => {
        console.log(picture);
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
