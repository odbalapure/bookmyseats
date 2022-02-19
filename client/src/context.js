import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [warning, setWarning] = useState("");
  const [search, setSearch] = useState("");

  /**
   * @desc Check if a user is logged in
   */
  useEffect(() => {
    if (localStorage.getItem("bookmyseat_user")) {
      if (JSON.parse(localStorage.getItem("bookmyseat_user")).name !== "") {
        setIsLoggedIn(true);
      }
    }
  }, []);

  /**
   * @desc  Get vehicles
   * @request GET
   */
  const getTheaters = useCallback(async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "/theaters";

      if (JSON.parse(localStorage.getItem("bookmyseat_user"))) {
        const response = await axios.get(url, {
          headers: {
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("bookmyseat_user")).token,
          },
        });

        setTheaters(response.data.theaters);
      }
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the vehicles...");
    }
  }, []);

  useEffect(() => {
    getTheaters();
  }, [search, getTheaters]);

  /**
   * @desc Get movie list
   * @request GET
   */
  const getAllMovies = useCallback(async () => {
    try {
      const url = process.env.REACT_APP_API_URL + `/movies?search=${search}`;
      const response = await axios.get(url);

      let movieMap = new Map();
      response.data.movies.forEach((movie) => {
        movieMap.set(movie.name, movie);
      });

      let movies = [];
      movieMap.forEach((value) => movies.push(value));
      setMovies(movies);
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the vehicles...");
    }
  }, [search]);

  useEffect(() => {
    getAllMovies();
  }, [getAllMovies]);

  return (
    <AppContext.Provider
      value={{
        theaters,
        getTheaters,
        search,
        setSearch,
        warning,
        isLoggedIn,
        movies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
