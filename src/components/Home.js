import React, { Component } from "react";
import "./../App.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import { ReactComponent as EmptySvg } from "./../assets/empty.svg";
import HeartLogo from "./../assets/icon_heart.png";
import { Button, Container, Row, Col, Input, Label } from "reactstrap";
import "./Home.css";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

class Home extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { searchValue: "" };
    this.state = { movies: [] };
    this.state = { favouriteMovies: [] };
    this.state = { moviesNotFound: false };
    this.state = { error: "" };
    this.state = { loading: false };
    this.state = { user: this.props.cookies.get("user") || "" };
    this.searchMovie = this.searchMovie.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMoviesList = this.handleMoviesList.bind(this);
    this.handleCookie = this.handleCookie.bind(this);
  }

  handleCookie = () => {
    const { cookies } = this.props;
    cookies.set("user", uuidv4(), { path: "/" }); // setting the cookie
    this.setState({ user: cookies.get("user") });
  };

  handleKeyDown(e) {
    if (e.key === "Enter") {
      if (
        this.state.searchValue === undefined ||
        this.state.searchValue.trim() === ""
      )
        return;

      this.searchMovie();
    }
  }

  searchMovie(mySearch) {
    if (mySearch === undefined || !(mySearch instanceof Event)) {
      if (this.state.searchValue !== undefined) {
        mySearch = this.state.searchValue;
      }
    }
    this.setState({ loading: true });
    this.setState({ error: false });

    fetch(
      `https://my-movie-list-challenge.herokuapp.com/movie/search-movie/${mySearch}/${this.state.user}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ loading: false });
        this.setState({ moviesNotFound: false });
        if (data.Response === "False") {
          this.setState({ moviesNotFound: true });
          return;
        }
        this.setState({ movies: data });
        this.handleMoviesList();
      })
      .catch((error) => {
        this.setState({
          error: `Sorry, an error occurred while processing your request. Please try again later, or contact the system administrator. Check if the backend is Running... [Api: backend] \n${error}`,
        });
        console.error(error);
      });
  }

  handleMoviesList() {
    const newMovies = this.state.movies;
    const mySearchWord = this.state.searchValue;
    const myUserId = this.state.user;

    // set json to pass a parameter for edition
    newMovies.Search.forEach(function (element) {
      const jsonToPassAsParameter = {
        searchWord: mySearchWord,
        movieId: element.imdbID,
        idToRemove: element.idToRemove,
        userId: myUserId,
      };
      element.jsonToPassAsParameter = JSON.stringify(jsonToPassAsParameter);
    });

    // Sort by Favourite
    newMovies.Search.sort((a, b) => b.favouriteMovie - a.favouriteMovie);
    this.setState({ movies: newMovies });
  }

  componentDidMount() {
    // userID
    console.log(this.state.user);

    // set a cookie if for a new user
    if (this.state.user === "") {
      this.handleCookie();
    }

    // userID after handle
    console.log(this.state.user);

    if (this.props.match.params.id !== undefined) {
      const mySearch = this.props.match.params.id;
      this.setState({ searchValue: mySearch });
      this.searchMovie(mySearch);
    }
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  render() {
    const { movies, moviesNotFound, error } = this.state;

    return (
      <div className='background-black'>
        <Header />
        <br></br>
        <Container className='themed-container'>
          <div>
            <Row>
              <Col sm='10'>
                <Input
                  placeholder='Search movies...'
                  type='text'
                  value={this.state.searchValue || ""}
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleChange}
                ></Input>
              </Col>
              <Col sm='2'>
                <Button
                  disabled={
                    this.state.searchValue === undefined ||
                    this.state.searchValue.trim() === ""
                  }
                  color='warning'
                  onClick={this.searchMovie}
                >
                  Click to Search
                </Button>
              </Col>
            </Row>
            <br></br>
            {(error !== undefined && error.length > 0) ||
            moviesNotFound ||
            movies === undefined ||
            movies.length === 0 ||
            movies.Search === undefined ? (
              <div>
                <Row>
                  <Col>
                    <EmptySvg className='illustration-empty-state'></EmptySvg>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label className='dont-know-what-to-s center'>
                      {error !== undefined && error.length > 0
                        ? error
                        : moviesNotFound
                        ? "Not Found..."
                        : "Don’t know what to search"}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label className='heres-an-offer-you center'>
                      {error !== undefined && error.length > 0
                        ? ""
                        : moviesNotFound
                        ? "Please... Try Again..."
                        : "Here’s an offer you can’t refuse"}
                    </Label>
                  </Col>
                </Row>
              </div>
            ) : (
              <div>
                <Row>
                  {movies.Search.map((item, index) => (
                    <Col key={index}>
                      <Link to={`/movies/${item.jsonToPassAsParameter}`}>
                        <div className='parent'>
                          <img
                            className='rectangle-4'
                            alt={index}
                            src={
                              item.Poster === "N/A"
                                ? "https://bitsofco.de/content/images/2018/12/broken-1.png"
                                : item.Poster
                            }
                          ></img>
                          {item.favouriteMovie ? (
                            <img
                              className='over-img'
                              src={HeartLogo}
                              alt='heart-logo'
                              width='24px'
                              height='24px'
                            ></img>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
          <div className='div-footer-home'></div>
        </Container>
      </div>
    );
  }
}
export default withCookies(Home);
