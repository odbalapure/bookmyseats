import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const url = process.env.REACT_APP_API_URL + "/payments";

function Payment() {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [warning, setWarning] = useState("");
  const [msg, setMsg] = useState("");

  /**
   * @desc Get username and phone number
   */
  useEffect(() => {
    if (localStorage.getItem("bookmyseat_user")) {
      setName(JSON.parse(localStorage.getItem("bookmyseat_user")).name);
      setEmail(JSON.parse(localStorage.getItem("bookmyseat_user")).email);
    }
  }, []);

  /**
   * @desc Make payment
   */
  const makePayment = () => {
    setWarning("");
    if (phone === "") {
      setWarning("You forgot to enter your phone number...");
      return;
    }

    if (
      phone.search(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im)
    ) {
      setWarning("Please enter a valid number...");
      return;
    }

    const user = {
      name,
      email,
      phone: `+91-${phone}`,
    };

    location.state.user = user;
    loadRazorpay(location.state);
  };

  /**
   * @desc Load razorpay script for payment
   */
  function loadRazorpay(order) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        /* Create order */
        order.amount += "00";
        order.amount = parseFloat(order.amount) + parseFloat(3250);
        const result = await axios.post(`${url}/create-order`, order, {
          headers: {
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("bookmyseat_user")).token,
          },
        });
        const { amount, id: order_id, currency } = result.data.order;

        /* Get razorpay key */
        const response = await axios.get(`${url}/get-razorpay-key`, {
          headers: {
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("bookmyseat_user")).token,
          },
        });
        const razorPayKey = response.data.key;

        /* Place the order */
        const options = {
          key: razorPayKey,
          amount: amount.toString(),
          currency: currency,
          name: "BookMySeats",
          description: "Online Transaction",
          order_id: order_id,
          handler: async function (response) {
            const result = await axios.post(
              `${url}/pay-order`,
              {
                user: order.user,
                name: order.name,
                date: order.date,
                from: order.to,
                to: order.to,
                seats: order.seats,
                theaterId: order.theaterId,
                theaterName: order.theaterName,
                amount: amount,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization:
                    "Bearer " +
                    JSON.parse(localStorage.getItem("bookmyseat_user")).token,
                },
              }
            );
            alert(result.data.msg);
            setMsg("Payment was successfull!");
          },
          prefill: {
            name: "BookMySeats",
            email: "bookmyseats@gmail.com",
            contact: "+91-1234567890",
          },
          notes: {
            address: "Bhugaon Wardha",
          },
          theme: {
            color: "#80c0f0",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        setWarning("Payment failed, please try again later...");
        setMsg("");
        console.log("Something went wrong!");
      }
    };

    document.body.appendChild(script);
  }

  return (
    <div
      className="d-flex flex-wrap justify-content-evenly"
      style={{ marginTop: "5rem" }}
    >
      <form
        className="border border-danger"
        style={{
          margin: "2rem",
          border: "1px solid lightgray",
          padding: "2rem",
          borderRadius: "1rem",
          width: "30rem",
        }}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter full name"
            defaultValue={name}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Enter emailid"
            defaultValue={email}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">
            Mobile
          </label>
          <input
            type="text"
            className="form-control"
            id="mobile"
            placeholder="Enter mobile number"
            onChange={(e) => setPhone(e.target.value)}
          />
          {msg ? (
            <div
              className="d-flex mt-3 justify-content-center flex-column align-items-center alert alert-success"
              role="alert"
            >
              {msg}
              <Link to="/">
                <button className="btn btn-success mt-3">Back to Home</button>
              </Link>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-danger mt-3"
                type="button"
                onClick={makePayment}
              >
                Make Payment
              </button>
            </div>
          )}
        </div>

        {warning ? (
          <p
            className="d-flex mt-3 justify-content-center align-items-center alert alert-danger"
            role="alert"
          >
            {warning} <span className="fs-3">🙂</span>
          </p>
        ) : null}
      </form>
      <div
        style={{
          margin: "2rem",
          border: "1px solid lightgray",
          padding: "2rem",
          borderRadius: "1rem",
          width: "20rem",
          height: "20rem",
          boxSizing: "border-box",
        }}
      >
        <div className="fs-4 mb-2 fw-bold">Order Summary</div>
        <hr />
        <div className="fs-5 fw-bold">{location.state.name}</div>
        <div>
          <b>Seats:</b> {location.state.seats.map((seat) => seat + " ")}
        </div>
        <div>
          <b>Ticket price:</b> ₹{location.state.totalAmount}
        </div>
        <div>
          <b>Convinience Fee:</b> ₹{32.5}
        </div>
        <div>
          <b>Show time:</b> {location.state.from} to {location.state.to}
        </div>
        <hr />
        <div>
          <p className="fs-5 fw-bolder text-danger">
            Sub Total: ₹
            {parseFloat(location.state.totalAmount) + parseFloat(32.5)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
