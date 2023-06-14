import React, {useState}from "react";
import "./UserCard.css"
const UserCard = ({ user }) => {
  const [showRepositories, setShowRepositories] = useState(false);
 
  const [repositories, setRepositories] = useState([]);
    const fetchRepositories = async () => {
      try {
        const response = await fetch(user.repos_url);
        if (response.ok) {
          const data = await response.json();
          setRepositories(data);
          setShowRepositories(true);
        }
      } catch (error) {
        
      }}
  
      const hideRepositories = () =>{
        setShowRepositories(false)
      }

  return (
      <div className="user-card">
      <a href={user.html_url}> {user.login}</a>
      <p>Name: {user.name}</p>
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <p>P: {user.login}</p>
      <p>ID: {user.id}</p>
      <p>Score: {user.score}</p>
      <p > Followers: {user.followers}</p>
      <button onClick={fetchRepositories}>Show Repositories</button>
      <button onClick={hideRepositories}>hideRepositories</button>
      {showRepositories && (
      <div className="repositories">
        <h3>Repositories:</h3>
        {repositories.length > 0 ? (
          <ul className="repo-list">
            {repositories.map((user) => (
              <li key={user.id}>{user.name}</li>
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
  

