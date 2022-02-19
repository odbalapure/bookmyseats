import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalContext } from "../context";

const url = process.env.REACT_APP_API_URL + "/movies";

function SingleMovie() {
  const { isLoggedIn } = useGlobalContext();
  const { id } = useParams();

  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [shows, setShows] = useState([]);
  const [btnClicked, setBtnClicked] = useState(false);
  const [warning, setWarning] = useState("");
  const [date, setDate] = useState("");


  /**
   * @desc Get movie details
   */
  const getMovie = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/${id}`);
      setMovie(response.data.movie);
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the movie details...");
    }
  }, [id]);

  useEffect(() => {
    getMovie();
  }, [getMovie]);

  /**
   * @desc Get booking details
   */
  const getMovieShowTimings = async (movieName) => {
    setBtnClicked(true);

    try {
      const response = await axios.get(`${url}/timings/${movieName}`);
      setShows(response.data.movies);
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the movie details...");
    }
  };

  /**
   * @desc Add a movie
   */
  const bookShow = () => {
    if (!isLoggedIn) {
      setWarning("You need to login before booking anny seats 🙂");
      return;
    }

    setWarning("");
    navigate(
      "/book",
      {
        state: {
          movie,
          date,
        },
      },
      { replace: true }
    );
  };

  return (
    <div className="container mb-4" style={{ marginTop: "5rem" }}>
      <div className="card" style={{ backgroundColor: "#dae7ed" }}>
        <div className="card-body d-flex justify-content-center flex-wrap align-items-center">
          <div style={{ width: "19rem" }}>
            <img src={movie.image} alt={movie.name} className="w-100" />
          </div>
          <div
            className="p-5 d-flex flex-column"
            style={{ fontSize: "1.2rem" }}
          >
            <div>
              <div className="fs-2 fw-bold">{movie.name}</div>
              <hr />
            </div>
            <p>
              <b>Rating</b>: {movie.pgRating}
            </p>
            <p>
              <b>Release Date</b>: {movie.releaseDate}
            </p>
            <p>
              <b>Runtime</b>: <i>{(movie.runtime / 60).toFixed(2)}hrs</i>
            </p>
            <p>
              <b>Genre</b>: {movie.genre}
            </p>
            <p>
              <b>Price</b>: ₹{movie.price}
            </p>
            <button
              className="btn btn-danger"
              onClick={() => getMovieShowTimings(movie.name)}
            >
              Book Show
            </button>
          </div>
        </div>
      </div>
      {warning ? (
        <p
          className="d-flex justify-content-center alert alert-danger"
          role="alert"
        >
          {warning}
        </p>
      ) : null}
      {btnClicked ? (
        <div className="container mt-5">
          <p className="fs-4" style={{ fontWeight: "700" }}>
            Show Timings for "<span className="text-primary">{movie.name}</span>
            "
          </p>
          <hr />
          {shows.map((show) => {
            return (
              <div key={show._id} className="card m-4 p-3">
                <div className="d-flex justify-content-between flex-wrap">
                  <p className="fs-5">
                    <b>{show.theaterName}</b>
                  </p>
                  <button
                    className="btn btn btn-outline-success"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@mdo"
                  >
                    {show.from}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {/* Modal code */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Select seats
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control"
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="pt-1 text-muted">
                NOTE: Select a date before booking seats
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={bookShow}
                disabled={date ? false : true}
              >
                Book seats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleMovie;
