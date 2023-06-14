import React, { useState } from "react";
import "./App.css";
import UsersList from "./components/UsersList/UsersList";

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(1);
  const [sortBy, setSortBy] = useState("followers");
  const [sortOrder, setSortOrder] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");

  const fetchUsers = async (searchVal, page) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchVal}&sort=${sortBy}&order=${sortOrder}&per_page=${perPage}&page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.items);
        setTotalCount(data.total_count);
        console.log(data);
      } else {
        setUsers(null);
      }
    } catch (error) {}
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePerPageChange = (event) => {
    setPerPage(parseInt(event.target.value));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    fetchUsers(searchTerm, nextPage);
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      fetchUsers(searchTerm, prevPage);
      setCurrentPage(prevPage);
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (page > 0 && page <= Math.ceil(totalCount / perPage)) {
      fetchUsers(searchTerm, page);
      setCurrentPage(page);
      setInputPage();
    }
  };

  return (
    <div>
      <div>
        <input type="text" value={searchTerm} onInput={handleSearch} />
        <button onClick={() => searchTerm && fetchUsers(searchTerm, 1)}>
          Search
        </button>
      </div>
      <div>
        <label>
          Sort By:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="followers">Followers</option>
            <option value="score">Score</option>
            <option value="joined">joined</option>
            <option value="repos">repos</option>
          </select>
        </label>
        <label>
          Order:
          <select value={sortOrder} onChange={handleOrderChange}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>
        <label>
          Per Page:
          <select value={perPage} onChange={handlePerPageChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </label>
      </div>
      {totalCount === 0 ? (
        <div>No users found</div>
      ) : (
        <>
          {users?.length > 0 && <UsersList users={users} />}
          {users?.length > 0 && (
            <div>
              <button onClick={handlePrevPage}>prevPage</button>
              <button onClick={handleNextPage}>nextPage</button>
              <div>
                Go :{`${currentPage}`}
                <input
                  value={inputPage}
                  onChange={(event) => setInputPage(event.target.value)}
                />
                <button onClick={handleGoToPage}>Перейти</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
