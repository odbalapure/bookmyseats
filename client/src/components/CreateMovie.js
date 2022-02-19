import axios from "axios";
import { useRef, useState } from "react";
import { useLocation } from "react-router";

const url = process.env.REACT_APP_API_URL + "/movies";

function CreateMovie() {
  const [warning, setWarning] = useState("");
  const [msg, setMsg] = useState("");

  const [genre, setGenre] = useState("");
  const [pgRating, setPgRating] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const nameRef = useRef();
  const pgRef = useRef();
  const imageRef = useRef();
  const runtimeRef = useRef();

  const location = useLocation();

  /**
   * @desc Create a movie
   * @request POST
   */
  const createMovie = async () => {
    const movie = {
      name: nameRef.current.value,
      pgRating: pgRating,
      theaterId: location.state.theaterId,
      theaterName: location.state.theaterName,
      releaseDate: releaseDate,
      from: from,
      to: to,
      genre: genre,
      image: imageRef.current.value,
      runtime: runtimeRef.current.value,
    };

    setMsg("Adding movie, please wait...");

    if (nameRef.current.value === "" || pgRating === "") {
      setWarning("All the fields are madatory!");
      setMsg("");
      return;
    }

    try {
      setMsg("Creating a movie, please wait...");
      await axios.post(url, movie, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
      });

      setMsg("");
    } catch (error) {
      setWarning(
        "Something went wrong while creating the theater, try again some time later..."
      );
    }
  };

  return (
    <>
      <div className="container" style={{ marginTop: "5rem" }}>
        <form
          className="container p-3 mb-5"
          style={{ border: "1px solid lightgray", borderRadius: "1rem" }}
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Movie Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              ref={nameRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label fw-bold">
              Image
            </label>
            <input
              type="text"
              className="form-control"
              id="image"
              ref={imageRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label fw-bold">
              Select Film PG Rating
            </label>
            <select
              onChange={(event) => setPgRating(event.target.value)}
              id="rating"
              className="form-select"
              aria-label="Default select example"
            >
              <option>Select Film Rating</option>
              <option value="PG-13">Parental Guidance (PG-13)</option>
              <option value="U">Universal (U)</option>
              <option value="R">Age Restricted (R)</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Theater Name
            </label>
            <input
              defaultValue={location.state.theaterName}
              type="name"
              className="form-control"
              id="name"
              ref={pgRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              City
            </label>
            <input
              defaultValue={location.state.city}
              type="name"
              className="form-control"
              id="name"
              ref={pgRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="release" className="form-label fw-bold">
              Release Date
            </label>
            <input
              onChange={(e) => setReleaseDate(e.target.value)}
              className="form-control"
              id="release"
              type="date"
            />
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <label htmlFor="time" className="form-label fw-bold">
                Show Timing
              </label>
              <input
                onChange={(e) => setFrom(e.target.value)}
                className="form-control"
                id="time"
                type="time"
              />
            </div>
            <p style={{ marginTop: "2.4rem" }} className="fs-6 fw-bold">
              To
            </p>
            <div>
              <label htmlFor="time" className="form-label fw-bold"></label>
              <input
                onChange={(e) => setTo(e.target.value)}
                className="form-control"
                id="time"
                type="time"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label fw-bold">
              Select Genre
            </label>
            <select
              onChange={(event) => setGenre(event.target.value)}
              id="rating"
              className="form-select"
              aria-label="Default select example"
            >
              <option>Select Genre</option>
              <option value="Horror">Horror</option>
              <option value="Comedy">Comedy</option>
              <option value="Action">Action</option>
              <option value="Sci-Fi">Science Fiction</option>
              <option value="Drama">Drama</option>
            </select>
          </div>
          <div className="mb-3">
            <div>
              <label htmlFor="runtime" className="form-label fw-bold">
                Movie Runtime <span className="text-muted">(in minutes)</span>
              </label>
              <input className="form-control" id="runtime" type="number" ref={runtimeRef} />
            </div>
          </div>
          <div className="d-grid gap-2">
            <button
              onClick={createMovie}
              className="btn btn-primary"
              type="button"
            >
              Add Movie
            </button>
          </div>
          {warning ? (
            <p
              className="d-flex mt-3 justify-content-center alert alert-danger"
              role="alert"
            >
              {warning}
            </p>
          ) : null}
          {msg ? (
            <p
              className="d-flex fs-5 mt-3 justify-content-center alert alert-primary"
              role="alert"
            >
              {msg}
            </p>
          ) : null}
        </form>
      </div>
    </>
  );
}

export default CreateMovie;
