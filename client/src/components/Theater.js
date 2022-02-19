import { useGlobalContext } from "../context";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/theaters";

function Theater() {
  const navigate = useNavigate();
  const { theaters, getTheaters } = useGlobalContext();

  const [warning, setWarning] = useState("");
  const [msg, setMsg] = useState("");

  const ownerRef = useRef();
  const theaterRef = useRef();
  const helplineRef = useRef();
  const cityRef = useRef();

  useEffect(() => {
    getTheaters();
  }, [getTheaters]);

  /**
   * @desc Add a theater
   * @request POST
   */
  const addTheater = async () => {
    if (
      ownerRef.current.value === "" ||
      theaterRef.current.value === "" ||
      helplineRef.current.value === ""
    ) {
      setWarning("All the fields are madatory!");
      return;
    }

    setWarning("");

    const theater = {
      owner: ownerRef.current.value,
      name: theaterRef.current.value,
      helpline: helplineRef.current.value,
      city: cityRef.current.value,
    };

    try {
      setMsg("Creating a theater, please wait...");
      await axios.post(url, theater, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
      });

      getTheaters();
      setMsg("");
    } catch (error) {
      setWarning(
        "Something went wrong while creating the theater, try again some time later..."
      );
    }
  };

  /**
   * @desc Add a movie
   * @request POST
   */
  const addMovie = (theaterId, theaterName, city) => {
    navigate(
      "/create-movie",
      {
        state: {
          theaterId,
          theaterName,
          city,
        },
      },
      { replace: true }
    );
  };

  /**
   * @desc Delete theater details
   * @request DELETE
   */
  const deleteTheater = async (theaterId) => {
    try {
      setMsg("Deleteing theater...");
      const response = await axios.delete(`${url}/${theaterId}`, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
      });

      getTheaters();
      setMsg(response.data.msg);

      setTimeout(() => {
        setMsg("");
      }, 1000);
    } catch (error) {
      setWarning("Something went wrong while deleting the theater...");
    }
  };

  /**
   * @desc Pass theater details to another route
   */
  const editTheater = async (theater) => {
    navigate(
      "/edit-theater",
      {
        state: theater,
      },
      { replace: true }
    );
  };

  return (
    <>
      <div style={{ marginTop: "5rem" }}>
        <form
          className="container p-3"
          style={{ border: "1px solid lightgray", borderRadius: "1rem" }}
        >
          <div className="mb-3">
            <label htmlFor="owner" className="form-label fw-bold">
              Owner Name
            </label>
            <input
              type="owner"
              className="form-control"
              id="owner"
              ref={ownerRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Theater Name
            </label>
            <input
              type="name"
              className="form-control"
              id="name"
              ref={theaterRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label fw-bold">
              City
            </label>
            <input
              type="city"
              className="form-control"
              id="city"
              ref={cityRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="helpline" className="form-label fw-bold">
              Helpline Number
            </label>
            <input
              type="helpline"
              className="form-control"
              id="helpline"
              ref={helplineRef}
            />
          </div>
          <div className="d-grid gap-2">
            <button
              onClick={addTheater}
              className="btn btn-primary"
              type="button"
            >
              Add Theater
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

        <div className="container mt-5 mb-5">
          <p className="fs-3 fw-bold">Your theaters</p>
          <hr />
          {theaters.map((theater) => {
            return (
              <div className="card mb-3" key={theater._id}>
                <div className="fs-4 fw-bold card-header d-flex justify-content-between">
                  <div>{theater.name}</div>
                  <div>
                    <button
                      type="button modal-dialog modal-dialog-centered"
                      className="btn-close"
                      aria-label="Close"
                      style={{ fontSize: "1rem" }}
                      onClick={() => deleteTheater(theater._id)}
                    ></button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="fs-6 d-flex justify-content-between">
                    <div>
                      <b>Owner</b>: {theater.owner}
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => editTheater(theater)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </div>
                  </div>
                  <div className="fs-6">
                    <b>Helpline</b>: {theater.helpline}
                  </div>
                  <div className="fs-6">
                    <b>Create At</b>: {theater.createdAt}
                  </div>
                  <div className="fs-6">
                    <b>City</b>: {theater.city}
                  </div>
                </div>
                <div className="fs-4 card-header">
                  <button
                    onClick={() =>
                      addMovie(theater._id, theater.name, theater.city)
                    }
                    className="btn btn-success"
                  >
                    Add a movie
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Theater;
