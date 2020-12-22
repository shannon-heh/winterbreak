/* Profile provides user profile functionality on /p/profile */
export function Profile() {

    let profile = localStorage.getItem("profile");

    return <div>{profile}</div>;
}
