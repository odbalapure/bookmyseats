import axios from "axios";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const url = process.env.REACT_APP_API_URL + "/auth/login";

function Login() {
  const [warning, setWarning] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const navigateToUrls = () => navigate("/", { replace: true });

  const loginDetails = async (event) => {
    setMsg("Logging you in, please wait...");
    event.preventDefault();

    if (emailRef.current.value === "" || passwordRef.current.value === "") {
      setWarning("Email and password are mandatory!");
      return;
    }

    setWarning("");

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await axios.post(`${url}`, user);
      const localStorageObj = {
        name: response.data.name,
        email: response.data.email,
        token: response.data.token,
        role: response.data.role,
      };

      localStorage.setItem("bookmyseat_user", JSON.stringify(localStorageObj));
      setMsg("");
      navigateToUrls();
      window.location.reload(false);
    } catch (error) {
      setMsg("");
      setWarning("User may not exist or the account has not been verified!");
    }
  };

  return (
    <div
      style={{ marginTop: "5rem" }}
      className="container d-flex justify-content-center flex-wrap flex-column"
    >
      <div
        style={{
          border: "1px solid lightgray",
          padding: "1rem",
          margin: "2rem",
          borderRadius: "1rem",
          boxShadow: "-2px 2px 28px 0px rgba(0,0,0,0.75)",
        }}
      >
        <form className="p-3">
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              ref={emailRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              ref={passwordRef}
            />
          </div>
          <div className="d-flex justify-content-around align-items-center">
            <Link to="/signup">
              <button
                style={{
                  color: "dodgerblue",
                  fontWeight: "600",
                  borderStyle: "none",
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                }}
              >
                <u>Create Account</u>
              </button>
            </Link>
            <div style={{ width: "2rem" }}></div>
            <Link to="/forgot-password">
              <button
                style={{
                  color: "#f76865",
                  fontWeight: "600",
                  borderStyle: "none",
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                }}
              >
                <u>Forgot Password</u>
              </button>
            </Link>
          </div>
          <div className="mt-3 d-flex justify-content-evenly align-items-center">
            <button
              type="submit"
              className="btn btn-success"
              onClick={loginDetails}
              style={{ width: "15rem" }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div>
        {warning ? (
          <p
            className="d-flex justify-content-center alert alert-danger"
            role="alert"
          >
            {warning}
          </p>
        ) : null}
      </div>
      {msg ? (
        <p
          className="d-flex fs-4 justify-content-center alert alert-primary"
          role="alert"
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}

export default Login;

// await axios.post(`${url}`, user, {
//   headers: {
//     Authorization:
//       "Bearer " + JSON.parse(localStorage.getItem("url_shortner_user")).token,
//   },
// });
