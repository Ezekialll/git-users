
import React from "react";
import UserCard from "../UserCard/UserCard";

import './UsersList.css'
import { useLocation } from "react-router-dom";

const UsersList = ({ users }) => {

  const params = useLocation();
  console.log(params)


  return (
    <div className="users-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
