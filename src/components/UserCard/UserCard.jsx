import React, { useState } from "react";
import "./UserCard.css";
const UserCard = ({ user }) => {
  const [showRepositories, setShowRepositories] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");

  const fetchRepositories = async () => {
    try {
      const response = await fetch(user.repos_url);
      if (response.ok) {
        const data = await response.json();
        setRepositories(data);
        setShowRepositories(!showRepositories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(user.url);
      if (response.ok) {
        const data = await response.json();
        setBio(data.bio);
        setLocation(data.location);
        setOrganization(data.company);
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="user-card">
      <a href={user.html_url}>{user.login}</a>
      <p>Name: {user.name}</p>
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <p>P: {user.login}</p>
      <p>ID: {user.id}</p>
      <p>Score: {user.score}</p>
      <p>Type: {user.type}</p>
      <p>Bio: {bio}</p>
      <p>Location: {location}</p>
      <p>Organization: {organization}</p>
      <a href={user.followers_url}>Followers: {user.followers_url}</a>
      <button onClick={fetchRepositories}>
        {showRepositories ? "Hide Repositories" : "Show Repositories"}
      </button>
      <button onClick={fetchUserDetails}>Fetch User Details</button>
      {showRepositories && (
        <div className="repositories">
          <h3>Repositories:</h3>
          {repositories.length > 0 ? (
            <ul className="repo-list">
              {repositories.map((repo) => (
                <li key={repo.id}>{repo.name}</li>
              ))}
            </ul>
          ) : (
            <div>No repositories</div>
          )}
        </div>
      )}
      
    </div>
  );
};




export default UserCard;