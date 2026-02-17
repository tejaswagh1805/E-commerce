import React, { useEffect, useState } from "react";

const Profile = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [image, setImage] = useState("");
    const [newImage, setNewImage] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        const response = await fetch(`http://172.16.60.17:5000/profile/${user._id}`, {
            headers: {
                authorization: `bearer ${token}`
            }
        });

        const result = await response.json();

        setName(result.name);
        setEmail(result.email);
        setMobile(result.mobile);
        setImage(result.image);
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("mobile", mobile);

        if (newImage) {
            formData.append("image", newImage);
        }

        const response = await fetch(
            `http://172.16.60.17:5000/profile/${user._id}`,
            {
                method: "PUT",
                headers: {
                    authorization: `bearer ${token}`
                },
                body: formData
            }
        );

        const result = await response.json();
        alert("Profile Updated Successfully!");
    };

    return (
    <div className="profile-wrapper">

        <div className="profile-card animate-fade">

            <div className="profile-header">
                <h3>My Profile</h3>
                <p>Manage your account information</p>
            </div>

            <div className="profile-content">

                {/* LEFT SIDE - IMAGE */}
                <div className="profile-left">

                    <div className="image-container">
                        <img
                            src={
                                newImage
                                    ? URL.createObjectURL(newImage)
                                    : image
                                        ? `http://172.16.60.17:5000/uploads/${image}`
                                        : "https://via.placeholder.com/150"
                            }
                            alt="Profile"
                        />
                    </div>

                    <input
                        type="file"
                        className="form-control mt-3"
                        onChange={(e) => setNewImage(e.target.files[0])}
                    />

                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="profile-right">

                    <form onSubmit={updateProfile}>

                        <div className="floating-group">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label>Name</label>
                        </div>

                        <div className="floating-group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email</label>
                        </div>

                        <div className="floating-group">
                            <input
                                type="text"
                                required
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                            <label>Mobile</label>
                        </div>

                        <button className="btn-update">
                            Update Profile
                        </button>

                    </form>

                </div>
            </div>

        </div>
    </div>
);

};

export default Profile;
