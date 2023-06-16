import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useLocation,} from "react-router-dom";


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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSortBy = localStorage.getItem("sortBy");
    const savedSortOrder = localStorage.getItem("sortOrder");
    const savedPerPage = localStorage.getItem("perPage");

    if (savedSortBy) setSortBy(savedSortBy);
    if (savedSortOrder) setSortOrder(savedSortOrder);
    if (savedPerPage) setPerPage(parseInt(savedPerPage));
  }, []);


  useEffect(() => {
    fetchUsers("a", currentPage, perPage, sortBy, sortOrder);
  }, [currentPage, perPage, sortBy, sortOrder]);

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("sortOrder", sortOrder);
    localStorage.setItem("perPage", perPage.toString());
  }, [sortBy, sortOrder, perPage]);

  const fetchUsers = async (searchVal, page, perPage) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchVal}&sort=${sortBy}&order=${sortOrder}&per_page=${perPage}&page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.items);
        setTotalCount(data.total_count);
      } else {
        setUsers(null);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmoothScroll = () => {
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(2, c - c / 14);
      }
    };
    scrollToTop();
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

  const handleNextPage = async () => {
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
      setInputPage("");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setInputPage("");
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const maxPage = Math.min(Math.ceil(totalCount / perPage), Math.ceil(1000 / perPage));


  const handleLastPage = async () => {
    const totalPages = Math.ceil(totalCount / perPage);
    const lastPage = Math.min(totalPages, Math.ceil(1000 / perPage));
    fetchUsers(searchTerm, lastPage);
    setCurrentPage(lastPage);
  };

  return (
    <Router>
      <div className="google-page">
      
        <center>
          <div className="search-container">
            <span className="logo-text">GithubUsers</span>

            <div className="search-bar">
              <input
                type="text"
                value={searchTerm}
                onInput={handleSearch}
                placeholder=""
              />
              <button
                className="search-button"
                onClick={() =>
                  searchTerm && fetchUsers(searchTerm, 1, perPage)
                }
              >
                Search
              </button>
              <button className="clear-button" onClick={handleClearSearch}>
                Clear
              </button>
            </div>
          </div>
          <div className="options-container">
            <label className="sort-label">
              Sort By:
              <select
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="followers">Followers</option>
                <option value="score">Score</option>
                <option value="joined">Joined</option>
                <option value="repos">Repos</option>
              </select>
            </label>
            <label className="order-label">
              Order:
              <select
                className="order-select"
                value={sortOrder}
                onChange={handleOrderChange}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
            <label className="per-page-label">
              Per Page:
              <select
                className="per-page-select"
                value={perPage}
                onChange={handlePerPageChange}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </label>
          </div>
          {totalCount === 0 ? (
            <div className="no-users">No users found</div>
          ) : (
            <>
                  

              {users?.length > 0 && <UsersList users={users} />}
              {users?.length > 0 && (
                <div className="pagination">
                  <button
                    className="last-page-button"
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                  >
                    First Page
                  </button>
                  <button className="prev-button" onClick={handlePrevPage}>
                    <Link to={`/page/${currentPage - 1}`}>prevPage</Link>
                  </button>
                  <div className="go-to-page">
                    Go: {`${currentPage}`}
                    <input
                      placeholder={`Перейти ${currentPage}`}
                      className="input-page"
                      value={inputPage}
                      onChange={(event) =>
                        setInputPage(event.target.value)
                      }
                    />
                    <button className="go-button" onClick={handleGoToPage}>
                      Go
                    </button>
                    <button
                      className="next-button"
                      onClick={handleNextPage}
                      disabled={
                        currentPage >= Math.ceil(totalCount / perPage)
                      }
                    >
                      <Link to={`/page/${currentPage + 1}`}>nextPage</Link>
                    </button>
                    <button
                          onClick={handleLastPage}
                          disabled={currentPage === Math.ceil(totalCount / perPage)}
                        >
                          Max Page {`${maxPage}`}
                        </button>

                    <div className="total-pages">
                      Total Pages: {Math.ceil(totalCount / perPage)}
                      
                    </div>
                    <button className="scroll-button" onClick={handleSmoothScroll}>
                      Scroll to Top
                    </button> 
                  </div>
                </div>
              )}
            </>
          )}
        </center>
      </div>
    </Router>
  );
};

export default App;













/*
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers(searchTerm, currentPage, perPage);
  }, [searchTerm, currentPage, perPage]);

  const fetchUsers = async (searchVal, page, perPage) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchVal}&sort=${sortBy}&order=${sortOrder}&per_page=${perPage}&page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.items);
        setTotalCount(data.total_count);
        console.log(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (page > 0 && page <= Math.ceil(totalCount / perPage)) {
      setCurrentPage(page);
      setInputPage("");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setInputPage("");
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    const lastPage = Math.ceil(totalCount / perPage);
    setCurrentPage(lastPage);
  };

  return (
    <Router>
      <div className="google-page">
        <center>
          <div className="search-container">
            <span className="logo-text">GithubUsers</span>

            <div className="search-bar">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder=""
              />
              <button
                className="search-button"
                onClick={() =>
                  searchTerm && fetchUsers(searchTerm, 1, perPage)
                }
              >
                Search
              </button>
              <button className="clear-button" onClick={handleClearSearch}>
                Clear
              </button>
            </div>
          </div>
          <div className="options-container">
            <label className="sort-label">
              Sort By:
              <select
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="followers">Followers</option>
                <option value="score">Score</option>
                <option value="joined">Joined</option>
                <option value="repos">Repos</option>
              </select>
            </label>
            <label className="order-label">
              Order:
              <select
                className="order-select"
                value={sortOrder}
                onChange={handleOrderChange}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
            <label className="per-page-label">
              Per Page:
              <select
                className="per-page-select"
                value={perPage}
                onChange={handlePerPageChange}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </label>
          </div>
          <Routes>
            <Route exact path="/">
              {totalCount === 0 ? (
                <div className="no-users">No users found</div>
              ) : (
                <>
                  {users?.length > 0 && <UsersList users={users} />}
                  {users?.length > 0 && (
                    <div className="pagination">
                      <button
                        className="last-page-button"
                        onClick={handleFirstPage}
                        disabled={currentPage === 1}
                      >
                        First Page
                      </button>
                      <button
                        className="prev-button"
                        onClick={handlePrevPage}
                      >
                        <Link to={`/page/${currentPage - 1}`}>prevPage</Link>
                      </button>
                      <div className="go-to-page">
                        Go: {`${currentPage}`}
                        <input
                          placeholder={`Перейти ${currentPage}`}
                          className="input-page"
                          value={inputPage}
                          onChange={(event) =>
                            setInputPage(event.target.value)
                          }
                        />
                        <button className="go-button" onClick={handleGoToPage}>
                          Go
                        </button>
                        <button
                          className="next-button"
                          onClick={handleNextPage}
                          disabled={
                            currentPage >=
                            Math.ceil(totalCount / perPage)
                          }
                        >
                          <Link to={`/page/${currentPage + 1}`}>nextPage</Link>
                        </button>
                        <button
                          onClick={handleLastPage}
                          disabled={
                            currentPage ===
                            Math.ceil(totalCount / perPage - 100)
                          }
                        >
                          Last Page
                        </button>
                        <div className="total-pages">
                          Total Pages: {Math.ceil(totalCount / perPage)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Route>
            <Route path="/page/:pageNum">
              <UsersList users={users} />
            </Route>
          </Routes>
        </center>
      </div>
    </Router>
  );
};

export default App;

*/