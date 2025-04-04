import { useState, useEffect, useContext } from "react";
import "./styles/Profile.css";
import Health from "../health.jpeg";
import ProfilePic from "../profilePic.png";
import { AuthContext } from "../context/authContextValue";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
    subscriptionPlan: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postal: "",
    country: "",
    height: "",
    weight: "",
    condition: "",
    allergy: "",
  });
  const [tempPic, setTempPic] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user || !user.profileId) return; // Exit if no user or profileId

    try {
      const response = await fetch(
        `/api/all_users/profile/${user.profileId}`, // Use the profileId from the user object
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfileData(data.profile); // Assuming the API returns the profile data directly
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const handleEditProfilePic = () => {
    document.getElementById("profilePicInput").click();
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempPic(reader.result);
        setShowConfirmation(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmProfilePicChange = () => {
    setProfileData((prevData) => ({
      ...prevData,
      profileImage: tempPic,
    }));
    setShowConfirmation(false);
  };

  const cancelProfilePicChange = () => {
    setTempPic(null);
    setShowConfirmation(false);
  };

  const handleProfileInfoChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHealthInfoChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveProfileInfo = async () => {
    setIsEditingProfile(false);
    try {
      const response = await fetch(`/api/users/profile/${user.profileId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Profile updated successfully:", result);
      setProfileData(result.profile);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const saveHealthInfo = async () => {
    setIsEditingHealth(false);
    try {
      const response = await fetch(`/api/users/profile/${user.profileId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Health information updated successfully:", result);
      setProfileData(result.profile);
    } catch (error) {
      console.error("Failed to update health information:", error);
    }
  };
  return (
    <div id="profile-container" className="profile-container">
      <div className="profile-navbar-spacer"></div>
      <div className="profile-section">
        <div className="image-wrapper">
          <img
            src={profileData.profileImage || ProfilePic}
            alt="Profile"
            className="profile-pic"
          />
          <div className="edit-icon" onClick={handleEditProfilePic}>
            ✏️
          </div>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
          />
        </div>
        <h2 className="info-heading">Profile Information</h2>
        {isEditingProfile ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfileInfo();
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td>First Name:</td>
                  <td>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                {user?.role === "member" && (
                  <tr>
                    <td>Subscription Plan:</td>
                    <td>{profileData.subscriptionPlan}</td>
                  </tr>
                )}
                <tr>
                  <td>Birthday:</td>
                  <td>
                    <input
                      type="date"
                      name="birthday"
                      value={profileData.dateOfBirth}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Gender:</td>
                  <td>
                    <input
                      type="text"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td>
                    <input
                      type="text"
                      name="address1"
                      value={profileData.address1}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>City:</td>
                  <td>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Province:</td>
                  <td>
                    <input
                      type="text"
                      name="province"
                      value={profileData.province}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Postal Code:</td>
                  <td>
                    <input
                      type="text"
                      name="postal"
                      value={profileData.postal}
                      onChange={handleProfileInfoChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Country:</td>
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileInfoChange}
                  />
                </tr>
              </tbody>
            </table>
            <button className="edit-button" type="submit">
              Save
            </button>
            <button
              className="edit-button"
              type="button"
              onClick={() => setIsEditingProfile(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <table>
              <tbody>
                <tr>
                  <td>First Name:</td>
                  <td>{profileData.firstName}</td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td>{profileData.lastName}</td>
                </tr>
                {user?.role === "member" && (
                  <tr>
                    <td>Subscription Plan:</td>
                    <td>{profileData.subscriptionPlan}</td>
                  </tr>
                )}
                <tr>
                  <td>Birthday:</td>
                  <td>{profileData.dateOfBirth}</td>
                </tr>
                <tr>
                  <td>Gender:</td>
                  <td>{profileData.gender}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>{profileData.phone}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td>{`${profileData.address1}, ${profileData.address2}`}</td>
                </tr>
                <tr>
                  <td>City:</td>
                  <td>{profileData.city}</td>
                </tr>
                <tr>
                  <td>Province:</td>
                  <td>{profileData.province}</td>
                </tr>
                <tr>
                  <td>Postal Code:</td>
                  <td>{profileData.postal}</td>
                </tr>
                <tr>
                  <td>Country:</td>
                  <td>{profileData.country}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="edit-button"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit Profile Info
            </button>
          </>
        )}
      </div>
      {user?.role === "member" && (
        <div className="health-section">
          <div className="image-wrapper">
            <img src={Health} alt="Health" className="health-pic" />
          </div>
          <h2>Health Information</h2>
          {isEditingHealth ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveHealthInfo();
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td>Height (cm):</td>
                    <td>
                      <input
                        type="number"
                        name="height"
                        value={profileData.height}
                        onChange={handleHealthInfoChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Weight (kg):</td>
                    <td>
                      <input
                        type="number"
                        name="weight"
                        value={profileData.weight}
                        onChange={handleHealthInfoChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Medical Conditions:</td>
                    <td>
                      <input
                        type="text"
                        name="condition"
                        value={profileData.condition}
                        onChange={handleHealthInfoChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Allergies:</td>
                    <td>
                      <input
                        type="text"
                        name="allergy"
                        value={profileData.allergy}
                        onChange={handleHealthInfoChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className="edit-button" type="submit">
                Save
              </button>
              <button
                className="edit-button"
                type="button"
                onClick={() => setIsEditingHealth(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <table>
                <tbody>
                  <tr>
                    <td>Height:</td>
                    <td>{profileData.height} cm</td>
                  </tr>
                  <tr>
                    <td>Weight:</td>
                    <td>{profileData.weight} kg</td>
                  </tr>
                  <tr>
                    <td>Medical Conditions:</td>
                    <td>{profileData.condition}</td>
                  </tr>
                  <tr>
                    <td>Allergies:</td>
                    <td>{profileData.allergy}</td>
                  </tr>
                </tbody>
              </table>
              <button
                className="edit-button"
                onClick={() => setIsEditingHealth(true)}
              >
                Edit Health Info
              </button>
            </>
          )}
        </div>
      )}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Confirm Profile Picture Change</h3>
            <img
              src={tempPic}
              alt="Temporary Profile"
              className="temp-pic-preview"
            />
            <div className="modal-buttons">
              <button onClick={confirmProfilePicChange}>Confirm</button>
              <button onClick={cancelProfilePicChange}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;