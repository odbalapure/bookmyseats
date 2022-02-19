import { useGlobalContext } from "../context";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const { movies, setSearch } = useGlobalContext();

  /**
   * @desc Get movie details
   * @param {*} movieId
   */
  const showMovieDetails = (movieId) => {
    navigate(
      `/movie/${movieId}`,
      {
        state: {},
      },
      { replace: true }
    );
  };

  /**
   * @desc Search a movie
   */
  const searchMovie = async (movie) => {
    setSearch(movie);
  };

  return (
    <>
      <div
        style={{
          marginTop: "5.5rem",
          color: "#cae7fc",
          marginLeft: "2rem",
          marginRight: "2rem",
          background:
            "linear-gradient(90deg, rgba(235,42,42,1) 100%, rgba(244,217,217,1) 100%)",
        }}
        className="jumbotron p-5 rounded"
      >
        <h1 className="display-4">
          Welcome to{" "}
          <b style={{ color: "#fff", fontWeight: "600" }}>BookMySeats</b>!
        </h1>
        <p className="lead">
          Search and book movie shows online. You can also filter movies based
          on location or genre!
        </p>
        <hr style={{ color: "white" }} />
        <input
          className="form-control"
          placeholder="Search a movie"
          onChange={(e) => searchMovie(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "3rem" }}>
        <div className="container section d-flex justify-content-evenly flex-wrap">
          {movies.map((movie) => {
            return (
              <div
                className="card mb-5"
                key={movie._id}
                style={{
                  width: "20rem",
                  height: "33rem",
                  cursor: "pointer",
                }}
                onClick={() => showMovieDetails(movie._id)}
              >
                <div className="card-body">
                  <img
                    className="w-100 h-100 img-fluid"
                    src={movie.image}
                    alt={movie.name}
                  />
                </div>
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#a3c1d4",
                  }}
                >
                  <b>{movie.name}</b>{" "}
                  <span className="text-muted">({movie.genre})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
