function Footer() {
  const footerStyle = {
    paddingTop: "1rem",
    fontSize: "1rem",
    color: "rgb(158, 187, 187)",
    backgroundColor: "#1a2538",
    left: 0,
    bottom: 0,
    width: "100%",
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100%",
          color: "azure",
          backgroundColor: "#333",
          height: "3rem",
        }}
      >
        <a
          href="#goto-top"
          alt="Back to top"
          style={{ textDecoration: "none", color: "azure" }}
        >
          Back to top
        </a>
      </div>
      <div style={footerStyle}>
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap p-3">
            <div>
              <p style={{ textAlign: "center" }}>
                <big>
                  <b>
                    <u>Contact</u>
                  </b>
                </big>
              </p>
              <ol
                style={{
                  textAlign: "center",
                  listStyle: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <li>
                  <span>
                    <b>Helpline</b>
                  </span>
                  : +91-1231231230
                </li>
                <li>
                  <span>
                    <b>Instagram ID</b>
                  </span>
                  : bookmywseats-please
                </li>
                <li>
                  <span>
                    <b>Email</b>
                  </span>
                  : bookmyseats@gmail.com
                </li>
              </ol>
            </div>
          </div>
          <hr />
          <p
            style={{
              fontSize: "1.5rem",
              textAlign: "center",
              paddingBottom: "2rem",
              color: "white"
            }}
          >
            BookMySeats ©
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
