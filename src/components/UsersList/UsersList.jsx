
import React from "react";
import UserCard from "../UserCard/UserCard";

import './UsersList.css'

const UsersList = ({ users }) => {
  return (
    <div className="users-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
