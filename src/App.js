import React, { useState ,useEffect} from "react";
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
    fetchUsers("a", currentPage, perPage);
  }, [currentPage, perPage]);

  
  
  
  
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
        setUsers(null);
      }
    } catch (error) {
      
    }
    finally {
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
      setInputPage();
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
    <div className="google-page">
      <center>
        <div className="search-container">

            <span className="logo-text">GithubUsers</span>
      
          <div className="search-bar">
            <input type="text" value={searchTerm} onInput={handleSearch} placeholder=""/>
            <button
              className="search-button"
              onClick={() => searchTerm && fetchUsers(searchTerm, 1)}
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
              <select className="sort-select" value={sortBy} onChange={handleSortChange}>
                <option value="followers">Followers</option>
                <option value="score">Score</option>
                <option value="joined">Joined</option>
                <option value="repos">Repos</option>
              </select>
            </label>
            <label className="order-label">
              Order:
              <select className="order-select" value={sortOrder} onChange={handleOrderChange}>
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
            <label className="per-page-label">
              Per Page:
              <select className="per-page-select" value={perPage} onChange={handlePerPageChange}>
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
                  prevPage
                </button>
                
                <div className="go-to-page">
                  Go: {`${currentPage}`}
                  <input
                  placeholder={`Перейти ${currentPage}`}
                    className="input-page"
                    value={inputPage}
                    onChange={(event) => setInputPage(event.target.value)}
                  />
                  <button className="go-button" onClick={handleGoToPage}>
                    Go
                  </button>
                  <button className="next-button" onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalCount / perPage)}> 
                  nextPage
                </button>
                <button
                  onClick={handleLastPage}
                  disabled={currentPage === Math.ceil(totalCount / perPage -100)}
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
      </center>
    </div>
  );
  
};

export default App;




