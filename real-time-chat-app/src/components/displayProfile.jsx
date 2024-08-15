import React from "react";
import { useAuth } from "../hooks/useAuth";
const displayProfile = () => {
  const { currentUser } = useAuth();
  console.log(currentUser)
  return (
    <>
        {currentUser ? (
            <div className="profile-header">
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="profile-picture-large"
            />
            <span className="profile-name">{currentUser.displayName}</span>
          </div>
        ) : ''}
    </>
  );
};

export default displayProfile;
