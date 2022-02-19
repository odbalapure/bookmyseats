import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import shortid from "shortid";

const url = process.env.REACT_APP_API_URL + "/bookings";

function BookShow() {
  const navigate = useNavigate();
  const seats = useRef(new Set());
  const location = useLocation();
  const [msg, setMsg] = useState("");
  const [warning, setWarning] = useState("");
  const [totalSeats, setTotalSeats] = useState([]);

  /* Display seats */
  const matrix = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
  );

  /**
   * @desc Check for booked seats
   */
  useEffect(() => {
    const showBookedSeats = async () => {
      const searchObj = {
        movieName: location.state.movie.name,
        theaterId: location.state.movie.theaterId,
        theaterName: location.state.movie.theaterName,
        from: location.state.movie.from,
        to: location.state.movie.to,
        date: location.state.date,
      };

      try {
        if (JSON.parse(localStorage.getItem("bookmyseat_user"))) {
          const response = await axios.get(url, {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("bookmyseat_user")).token,
            },
            params: {
              searchObj,
            },
          });

          if (response.data.seats) {
            for (let i = 0; i < response.data.seats.length; i++) {
              let seat = response.data.seats[i];
              let row = seat.charAt(0);
              let column = seat.substring(1, seat.length);
              document.getElementById(row + column).style = `
              height: 2rem; 
              width: 2rem;
              background-color: gray;
              border-radius: 0.2rem;
              text-align: center;
              color: azure;
              font-weight: "600";
              opacity: 0.5;
              `;
            }
          } else {
            setMsg(response.data.msg);
          }

          setWarning("");
        }
      } catch (err) {
        console.log(err);
        setWarning(
          "Something went wrong while booking this show...please try again later!"
        );
      }
    };

    showBookedSeats();
  }, [location.state]);

  /**
   * @desc Function to get seat number
   */
  const getSeatNumber = (e, row, column) => {
    if (
      document.getElementById(row + column).style.backgroundColor !== "gray"
    ) {
      if (
        document.getElementById(row + column).style.backgroundColor ===
        "darkgreen"
      ) {
        document.getElementById(row + column).style = `
        height: 2rem; 
        width: 2rem;
        background-color: #3d8f80;
        border-radius: 0.2rem;
        text-align: center;
        color: azure;
        font-weight: "600";
        `;

        seats.current.delete(row + column);
        setTotalSeats([...seats.current]);
      } else {
        document.getElementById(row + column).style = `
        height: 2rem; 
        width: 2rem;
        background-color: darkgreen;
        border-radius: 0.2rem;
        text-align: center;
        color: azure;
        font-weight: "600";
        `;

        seats.current.add(row + column);
        setTotalSeats([...seats.current]);
      }
    }
  };

  /**
   * @desc Confirm booking
   */
  const confirmBookng = async () => {
    if (totalSeats.length <= 0) {
      setWarning("Please select some seats before proceeding!");
      return;
    }

    const movieDetails = {
      name: location.state.movie.name,
      seats: totalSeats,
      from: location.state.movie.from,
      to: location.state.movie.to,
      price: location.state.movie.price,
      runTime: location.state.movie.runtime,
      theaterId: location.state.movie.theaterId,
      theaterName: location.state.movie.theaterName,
      amount: location.state.movie.price * totalSeats.length,
      totalAmount: location.state.movie.price * totalSeats.length,
      date: location.state.date,
    };

    navigate(
      "/payment",
      {
        state: movieDetails,
      },
      { replace: true }
    );

    setWarning("");
  };

  return (
    <div style={{ marginTop: "5rem" }} className="container">
      {/* Wrapper for screen and seat */}
      <div
        style={{ overflow: "auto" }}
        className="d-flex flex-column flex-wrap align-items-center"
      >
        <div
          style={{
            width: "50rem",
            height: "0.7rem",
            backgroundColor: "lightgray",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            boxShadow: "0px 9px 20px 0px rgba(92,148,222,0.75)",
          }}
        ></div>
        <div className="mb-3 fs-4">Psst...screen is over here!</div>
        <table disabled={true}>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    style={{
                      cursor: "pointer",
                    }}
                    className="p-2"
                  >
                    <div
                      style={{
                        height: "2rem",
                        width: "2rem",
                        backgroundColor: "#3d8f80",
                        borderRadius: "0.2rem",
                        textAlign: "center",
                        color: "azure",
                        fontWeight: "600",
                      }}
                      id={
                        String.fromCharCode(rowIndex + 65) + (columnIndex + 1)
                      }
                      onClick={(e) =>
                        getSeatNumber(
                          e,
                          String.fromCharCode(rowIndex + 65),
                          columnIndex + 1
                        )
                      }
                    >
                      {String.fromCharCode(rowIndex + 65)}
                      {columnIndex + 1}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="alert alert-light" role="alert"></div>
      </div>
      {/* Show details */}
      <div className="d-flex flex-column align-items-center mb-5">
        <div className="mb-1">
          <b>Movie</b>: {location.state.movie.name}
        </div>
        <div className="mb-1">
          <b>Theater</b>: {location.state.movie.theaterName}
        </div>
        <div className="mb-1">
          <b>Date</b>: {location.state.date}
        </div>
        <div className="mb-1">
          <b>Show time</b>: {location.state.movie.from}
        </div>
        <div className="mb-1">
          <b>Your seats</b>:{" "}
          {totalSeats.map((seat) => {
            return <span key={shortid.generate()}>{seat}&nbsp;</span>;
          })}
        </div>
        <div className="mb-1">
          <b>Total amount</b>: ₹{location.state.movie.price * totalSeats.length}
        </div>
        <button className="btn btn-danger" onClick={confirmBookng}>
          Confirm Booking
        </button>
      </div>
      {msg ? (
        <div
          className="d-flex mt-3 justify-content-center flex-column align-items-center alert alert-primary"
          role="alert"
        >
          {msg}
          <Link to="/">
            <button className="btn btn-primary mt-3">Back to Home</button>
          </Link>
        </div>
      ) : null}
      {warning ? (
        <p
          className="d-flex mt-3 justify-content-center alert alert-danger"
          role="alert"
        >
          {warning}
        </p>
      ) : null}
    </div>
  );
}

export default BookShow;
