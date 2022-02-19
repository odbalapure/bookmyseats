import Login from "./pages/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import EditTheater from "./pages/EditTheater";
import Payment from "./pages/Payment";
import Navbar from "./components/Navbar";
import Theater from "./components/Theater";
import CreateMovie from "./components/CreateMovie";
import SingleMovie from "./components/SingleMovie";
import BookShow from "./components/BookShow";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/theater" element={<Theater />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/edit-theater" element={<EditTheater />}></Route>
          <Route path="/bookings" element={<Bookings />}></Route>
          <Route path="/book" element={<BookShow />}></Route>
          <Route path="/create-movie" element={<CreateMovie />}></Route>
          <Route path="/movie/:id" element={<SingleMovie />}></Route>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="/reset-password/:email"
            element={<ResetPassword />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
