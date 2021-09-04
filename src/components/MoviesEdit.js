import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import Header from "./Header";
import "./MovieEdit.css";
import { ReactComponent as IconArrow } from "./../assets/icon__arrow.svg";
import { ReactComponent as LogoIMDB } from "./../assets/iconimdb.svg";

class MoviesEdit extends Component {
  emptyMovie = {
    Runtime: "",
    Year: "",
    Rated: "",
    Title: "",
    imdbRating: "",
    favouriteMovie: false,
    Plot: "",
    Actors: "",
    Genre: "",
    Director: "",
    Poster: "",
    idToRemove: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      movie: this.emptyMovie,
    };
    this.state = { isLoading: false };
    this.state = { searchWord: "" };
    this.state = { userId: "" };
    this.addToFavourites = this.addToFavourites.bind(this);
    this.removeFromFavourites = this.removeFromFavourites.bind(this);
  }

  async addToFavourites() {
    const myFavouriteMovie = {
      movieId: this.state.movie.imdbID,
      userId: this.state.userId,
    };

    await fetch("/favourite-movies", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myFavouriteMovie),
    });
    this.props.history.push(`/${this.state.searchWord}`);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      const myParams = JSON.parse(this.props.match.params.id);
      this.setState({ searchWord: myParams.searchWord });
      this.setState({ isLoading: true });
      this.setState({ userId: myParams.userId });
      const myMovieDetail = await (
        await fetch(`/movie/${myParams.movieId}`)
      ).json();

      if (myParams.idToRemove !== 0) {
        myMovieDetail.idToRemove = myParams.idToRemove;
        myMovieDetail.favouriteMovie = true;
      }
      this.setState({ movie: myMovieDetail });
      this.setState({ isLoading: false });
    }
  }

  async removeFromFavourites() {
    await fetch(`/favourite-movies/${this.state.movie.idToRemove}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {
      this.props.history.push(`/${this.state.searchWord}`);
    });
  }

  render() {
    const { movie, isLoading } = this.state;

    if (isLoading || movie === undefined) {
      return (
        <div className='background-black'>
          <Header />
          <br></br>
          <Container>
            <Row>
              <Col>
                <Link to='/'>
                  <IconArrow></IconArrow>
                </Link>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <label className='title'>Loading... Please Wait...</label>
              </Col>
            </Row>
          </Container>
          <div className='div-footer'></div>
        </div>
      );
    }

    return (
      <div className='background-black'>
        <Header />
        <br></br>
        <Container>
          <Row>
            <Col>
              <Link to={`/${this.state.searchWord}`}>
                <IconArrow></IconArrow>
              </Link>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs='6'>
              <label className='runtime'>
                {movie.Runtime} · {movie.Year} · {movie.Rated}
              </label>
              <label className='main-title'>{movie.Title}</label>
              <Row>
                <Col>
                  <LogoIMDB className='rectangle-9'></LogoIMDB>
                  <label className='rectangle-9-0-8-0-0 title-imdb'>
                    {movie.imdbRating}/10
                  </label>
                </Col>
                <Col>
                  {movie.favouriteMovie ? (
                    <Button color='danger' onClick={this.removeFromFavourites}>
                      Remove from favourites
                    </Button>
                  ) : (
                    <Button color='warning' onClick={this.addToFavourites}>
                      Add to favourites
                    </Button>
                  )}
                </Col>
              </Row>
              <br></br>
              <label className='title'>Plot</label>
              <p className='paragraph'>{movie.Plot}</p>
              <label className='title'>Cast</label>
              <p className='paragraph'>{movie.Actors}</p>
              <label className='title'>Genre</label>
              <p className='paragraph'>{movie.Genre}</p>
              <label className='title'>Director</label>
              <p className='paragraph'>{movie.Director}</p>
            </Col>
            <Col>
              <img
                alt='a poster for the movie'
                className='bg'
                src={
                  movie.Poster === "N/A"
                    ? "https://bitsofco.de/content/images/2018/12/broken-1.png"
                    : movie.Poster
                }
                width='100%'
                height='100%'
              ></img>
            </Col>
          </Row>
          )
        </Container>
        <div className='div-footer'></div>
      </div>
    );
  }
}
export default withRouter(MoviesEdit);
