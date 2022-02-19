import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/theaters";

function EditTheater() {
  const navigate = useNavigate();

  const navigateToTheaters = () => navigate("/theater", { replace: true });

  const location = useLocation();
  const [owner, setOwner] = useState("");
  const [theaterName, setTheaterName] = useState("");
  const [helpline, setHelpline] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");

  /**
   * @desc Edit theater details
   *
   */
  const editTheater = async () => {
    setMsg("Editing theater details...");

    const theater = {
      owner: owner || location.state.owner,
      name: theaterName || location.state.name,
      city: city || location.state.city,
      helpline: helpline || location.state.helpline,
    };

    try {
      if (JSON.parse(localStorage.getItem("bookmyseat_user"))) {
        await axios.patch(`${url}/${location.state._id}`, theater, {
          headers: {
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("bookmyseat_user")).token,
          },
        });

        setMsg("");
        navigateToTheaters();
      }
    } catch (err) {}
  };

  return (
    <div
      style={{
        marginTop: "5rem",
      }}
    >
      <form
        className="container p-3"
        style={{ border: "1px solid lightgray", borderRadius: "1rem" }}
      >
        <div className="mb-3">
          <label htmlFor="manufacturer" className="form-label fw-bold">
            Owner Name
          </label>
          <input
            onChange={(e) => setOwner(e.target.value)}
            defaultValue={location.state.owner}
            type="manufacturer"
            className="form-control"
            id="manufacturer"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="model" className="form-label fw-bold">
            Theater Name
          </label>
          <input
            onChange={(e) => setTheaterName(e.target.value)}
            defaultValue={location.state.name}
            type="model"
            className="form-control"
            id="model"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label fw-bold">
            City
          </label>
          <input
            onChange={(e) => setCity(e.target.value)}
            defaultValue={location.state.city}
            type="type"
            className="form-control"
            id="type"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cc" className="form-label fw-bold">
            Helpline
          </label>
          <input
            onChange={(e) => setHelpline(e.target.value)}
            defaultValue={location.state.helpline}
            type="cc"
            className="form-control"
            id="cc"
          />
        </div>
        <div className="d-grid gap-2">
          <button
            className="btn btn-warning"
            type="button"
            onClick={editTheater}
          >
            Edit Theater
          </button>
        </div>
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
  );
}

export default EditTheater;
