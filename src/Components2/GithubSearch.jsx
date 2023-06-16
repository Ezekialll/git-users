import React, { Component } from "react";
import "./GithubSearch.css"

const MyComponent = () => {
  const username = (username) => {
    return `https://api.github.com/users/${username}`;
  };

  class GithubSearch extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        github: null, // null
      };
    }

    componentDidMount() {
      fetch(username(this.props.username))
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            github: data,
          });
        });
    }

    render() {
      if (!this.state.github) return "loading";

      return (
        <div className="head">
          <div className="heading">
            <img src={this.state.github.avatar_url} alt="" />
            <h2>{this.state.github.name}</h2>
            <a href={this.state.github.login}>+</a>
            <p>{this.state.github.location}</p>
          </div>
          {/* about */}
          <div className="about">
          <div className="UserCard">{this.state.github.name}
            <div>
                    <a href="">link to gitHub</a>
                    <a href="">ShowRepositories</a>
            </div>
          </div>


            <p>
              <span>{this.state.github.followers_url}</span>
              <label htmlFor="">followers</label>
            </p>
            <p>
              <span>{this.state.github.following_url}</span>
              <label htmlFor="">Following</label>
            </p>
            <p>
              <span>{this.state.github.repos_url}</span>
              <label htmlFor="">repositories</label>
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <GithubSearch username="rafaballerini" />
    </div>
  );
};

export default MyComponent;
