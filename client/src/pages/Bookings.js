import { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);

  /**
   * @desc Get theaters created by an admin
   * @method GET
   */
  const getTheaters = async () => {
    const url = process.env.REACT_APP_API_URL + "/theaters";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
      });

      setTheaters(response.data.theaters);
    } catch (err) {}
  };

  useEffect(() => {
    getTheaters();
  }, []);

  /**
   * @desc Get bookings for a theater
   * @method GET
   */
  const getBookings = async (theaterId, theaterName) => {
    const url = process.env.REACT_APP_API_URL + "/bookings/shows";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
        params: {
          theaterId,
          theaterName,
        },
      });

      setShows(response.data.bookings);
    } catch (err) {}
  };

  return (
    <div className="container" style={{ marginTop: "6rem" }}>
      <ul className="nav nav-tabs">
        {theaters.map((theater) => {
          return (
            <li
              key={theater._id}
              style={{ cursor: "pointer" }}
              className="nav-item"
              onClick={() => getBookings(theater._id, theater.name)}
            >
              <div
                className="nav-link active"
                style={{
                  fontWeight: "600",
                  backgroundColor: "#e4e9f2",
                  border: "1px solid gray",
                }}
              >
                {theater.name}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="container mt-3">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">Movie</th>
              <th scope="col">User</th>
              <th scope="col">Seats</th>
              <th scope="col">Timing</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => {
              return (
                <tr key={show._id}>
                  <td style={{ width: "10rem" }}>{show.name}</td>
                  <td style={{ width: "15rem" }}>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">{show.user.name}</li>
                      <li className="list-group-item">{show.user.email}</li>
                      <li className="list-group-item">{show.user.phone}</li>
                    </ul>
                  </td>
                  <td>{show.seats.map((seat) => seat + "  ")}</td>
                  <td>
                    {show.from} to {show.to}
                  </td>
                  <td>₹{show.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-muted"><b>NOTE:</b> Click the tab to list shows</p>
      </div>
    </div>
  );
}

export default Bookings;
