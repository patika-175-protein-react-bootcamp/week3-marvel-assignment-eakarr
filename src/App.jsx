import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import axios from "axios";
import marvelLogo from "./assets/marvel-logo.png";
import marvelBackground from "./assets/super-heroes.png";

const hash = "2a1c1fd9ff3e606ef95c9fc9f3cd45d7";
const apikey = "1ec87bb86921fb33493233a6d71c8a6d";
const baseURL = "https://gateway.marvel.com:443/v1/public";

const service = axios.create({
  baseURL,
});

const App = () => {
  const [offset, setOffset] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveData = useCallback((offset, characters) => {
    localStorage.setItem(offset, JSON.stringify(characters));
  }, []);

  const getSavedData = useCallback((key) => {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  }, []);

  const fetchData = useCallback(
    async (offset = 0) => {
      const savedData = getSavedData(offset);

      if (savedData) {
        setCharacters(savedData);
        return;
      }

      try {
        setIsLoading(true);

        const result = await service.get("/characters", {
          params: { ts: 1, limit: 12, offset: offset * 12, apikey, hash },
        });

        const characters = result.data.data.results;

        setCharacters(characters);
        saveData(offset, characters);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [getSavedData, saveData]
  );

  useEffect(() => {
    fetchData(offset);
  }, [fetchData, offset]);

  return (
    <div className="container">
      {/* <!-- ////////////////////////////////// Upper Side Container Start //////////////////////////////////--> */}
      <div className="upper-side-container">
        <img
          src={marvelBackground}
          width="1920"
          height="1101"
          alt="super-heroes"
          className="super-heroes-img"
        />
        <img
          src={marvelLogo}
          alt="marvel-logo"
          width="600"
          height="290"
          className="marvel-logo-img"
        />
      </div>
      {/* <!-- ////////////////////////////////// Upper Side Container End //////////////////////////////////--> */}
      {/* <!-- ////////////////////////////////// Down Side Container Start //////////////////////////////////--> */}
      <div className="down-side-container">
        {characters?.map((character) => {
          return (
            <div key={character.id}>
              <div className="hero-cards">
                <img
                  width="216"
                  height="324"
                  src={
                    character.thumbnail.path +
                    "." +
                    character.thumbnail.extension
                  }
                  alt="hero"
                />
                <p>{character.name}</p>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <p
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
          }}
        >
          Data is loading...
        </p>
      )}
      {/* <!-- ////////////////////////////////// Down Side Container End //////////////////////////////////--> */}
      {/* <!-- ////////////////////////////////// Pagination Start //////////////////////////////////--> */}
      <div className="pagination">
        <ul>
          <li
            className="previous"
            onClick={() => setOffset((prev) => prev - 1)}
          >
            {"<"}
          </li>
          <li>1</li>
          <li>...</li>
          <li>99</li>
          <li className="current-page">100</li>
          <li>101</li>
          <li>...</li>
          <li>200</li>
          <li className="next" onClick={() => setOffset((prev) => prev + 1)}>
            {">"}
          </li>
        </ul>
      </div>
      {/* <!-- ////////////////////////////////// Pagination End //////////////////////////////////--> */}
      {/* <!-- ////////////////////////////////// Container End //////////////////////////////////--> */}
    </div>
  );
};

export default App;
