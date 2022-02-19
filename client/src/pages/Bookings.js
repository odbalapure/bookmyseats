import { useEffect } from "react";
import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/bookings/shows";

function Bookings() {
  const getBookings = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("bookmyseat_user")).token,
        },
      });
      console.log(response.data.bookings);
    } catch (err) {}
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      Bookings
    </div>
  );
}

export default Bookings;
