import React from "react";
interface UserProfileProps {
    name: string;
    email: string;
    university: string;
    major: string;
    classification: string;
    track: string;
    attendanceCount: number;
    isEligibleForCertificate: boolean;
  }
  
  const UserProfileCard: React.FC<UserProfileProps> = ({
    name,
    email,
    university,
    major,
    classification,
    track,
    attendanceCount,
    isEligibleForCertificate,
  }) => {
    return (
      <div className="user-profile-card">
        <h2>{name}</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>University:</strong> {university}</p>
        <p><strong>Major:</strong> {major}</p>
        <p><strong>Classification:</strong> {classification}</p>
        <p><strong>Track:</strong> {track}</p>
        <p><strong>Attendance Count:</strong> {attendanceCount}</p>
        <p>
          <strong>Certificate Eligibility:</strong>{" "}
          {isEligibleForCertificate ? "Eligible ✅" : "Not Eligible ❌"}
        </p>
      </div>
    );
  };
  
  export default UserProfileCard;