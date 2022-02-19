import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Navbar() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const navigateToProducts = () => navigate("/", { replace: true });

  useEffect(() => {
    if (localStorage.getItem("bookmyseat_user")) {
      if (
        JSON.parse(localStorage.getItem("bookmyseat_user")).role === "ADMIN"
      ) {
        setIsAdmin(true);
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("bookmyseat_user")) {
      setUsername(
        JSON.parse(localStorage.getItem("bookmyseat_user")).name.split(" ")[0]
      );
    }
  }, [username]);

  /* Function to logout user */
  const logoutUser = () => {
    localStorage.removeItem("bookmyseat_user");
    navigateToProducts();
    window.location.reload(false);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      <div id={"top"} className="container-fluid fs-5">
        <Link className="navbar-brand fs-4" to="/">
          BookMySeats
          <i
            style={{ color: "tomato" }}
            className="m-2 bi bi-ticket-perforated-fill"
          ></i>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAdmin ? (
              <li className="nav-item">
                <Link className="nav-link" to="/theater">
                  My Theaters
                </Link>
              </li>
            ) : null}
            {isAdmin ? (
              <li className="nav-item">
                <Link className="nav-link" to="/bookings">
                  Bookings
                </Link>
              </li>
            ) : null}
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Sign Up
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {username ? (
              <div className="d-flex align-items-center">
                <span style={{ color: "azure" }}>
                  Hello <i className="text text-primary fw-bold">{username}</i>!
                </span>{" "}
                &nbsp;&nbsp;
                <button
                  className="btn btn-outline-danger"
                  type="submit"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
