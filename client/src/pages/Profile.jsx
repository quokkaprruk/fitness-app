import { useState, useEffect } from "react";
import "./styles/Profile.css";
import Health from "../health.jpeg";
import ProfilePic from "../profilePic.png";

const Profile = () => {
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
  }, []);

  const fetchProfileData = async () => {
    // Simulating API call
    setProfileData({
      firstName: "Hello12346",
      lastName: "Test",
      profileImage: "",
      subscriptionPlan: "Basic Plan",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      phone: "1234567890",
      address1: "123 Main St",
      address2: "Apt 4B",
      city: "Anytown",
      province: "State",
      postal: "12345",
      country: "USA",
      height: "180",
      weight: "75",
      condition: "None",
      allergy: "None",
    });
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

  const saveProfileInfo = () => {
    setIsEditingProfile(false);
    // Here you would typically send the updated data to your server
  };

  const saveHealthInfo = () => {
    setIsEditingHealth(false);
    // Here you would typically send the updated data to your server
  };

  return (
    <div id="profile-container" className="profile-container">
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
                  <td>{profileData.firstName}</td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td>{profileData.lastName}</td>
                </tr>
                <tr>
                  <td>Subscription Plan:</td>
                  <td>{profileData.subscriptionPlan}</td>
                </tr>
                <tr>
                  <td>Birthday:</td>
                  <td>{profileData.dateOfBirth}</td>
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
                  <td>{profileData.country}</td>
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
                <tr>
                  <td>Subscription Plan:</td>
                  <td>{profileData.subscriptionPlan}</td>
                </tr>
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
