// App.js

import "./App.css";
import React, { useState } from 'react';
import axios from "axios";
import { ThumbsUp } from "phosphor-react";

const ApiKey = process.env.REACT_APP_API_KEY;
const AzureEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;

function App() {
  const [data, setData] = useState();
  const [image, setImage] = useState("");
  const [displayMsg, setDisplayMsg] = useState("Click run!");
  const [parsedData, setParsedData] = useState();
  const [similarCarsData, setSimilarCarsData] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (car) => {
    setWishlist((prevWishlist) => [...prevWishlist, car]);
  };

  const handleOnChange = (e) => {
    setImage(e.target.value);
  };

  const onButtonClick = async (e) => {
    e.preventDefault();
    setData();
    setDisplayMsg("Loading...");

    if (
      !image ||
      !(
        image.endsWith(".jpg") ||
        image.endsWith(".jpeg") ||
        image.endsWith(".png") ||
        image.endsWith(".webp")
      )
    ) {
      setImage();
      setDisplayMsg("Invalid image format or URL");
    } else {
      try {
        const fetchOptions = {
          method: "POST",
          timeout: 50000,
          headers: {
            "Ocp-Apim-Subscription-Key": ApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: image,
          }),
        };

        const response = await fetch(
          `${AzureEndpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=tags,caption`,
          fetchOptions,
        );

        const parsedData = await response.json();
        setData(parsedData);
        setParsedData(parsedData);

        console.log(parsedData.modelVersion);
        console.log(parsedData.captionResult.text);
        console.log(parsedData.metadata.width);
        console.log(parsedData.metadata.height);

      } catch (error) {
        console.error("There is an error during fetch:", error);
        setDisplayMsg("Sorry, there was an error.", error);
      }
    }
  };

  const getSimilarCars = () => {
    const sentence = parsedData.captionResult.text;
    const words = sentence.split(' ');
    const secondWord = words[1];

    axios.post("http://localhost:4000/posts/getcars", { data: secondWord })
      .then((response) => {
        console.log(response.data);
        setSimilarCarsData(response.data);
      });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to Turners Car Auctions</h1>
        <h3>Don't Dream It, Drive It</h3>
      </div>

      <div className="input-section">
        <input
          className="inputbox"
          placeholder="Please enter the image URL...."
          value={image}
          onChange={handleOnChange}
        />
        <button
          className="button"
          onClick={onButtonClick}
        >
          Run Service
        </button>
      </div>

      <section className="result-section">
        {image && <img src={image} width={320} height={180} alt={image} />}
        <p className="textclass">{data && data.captionResult.text}</p>

        {data &&
          data.tagsResult &&
          data.tagsResult.values.some((item) => item.name === "car") ? (
            <ul>
              {data.tagsResult.values.map((item) => (
                <li key={item.name}>
                  <span>
                    {item.name} - Confidence level {parseInt(item.confidence * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div>{displayMsg && <p>{displayMsg}</p>}</div>
          )}
      </section>

      <button onClick={getSimilarCars}>Get Similar Cars from Turners</button>
      {similarCarsData && (
        <div className="similar-cars-section">
          <h2>Similar Cars from Turners</h2>
          <ul>
            {similarCarsData.map((car) => (
              <li key={car.id}>
                <img src={car.image} alt={car.name} width={100} height={80} />
                <p>Name: {car.name}</p>
                <p>Color: {car.color}</p>
                <p>Amount: ${car.amount}</p>
                <button onClick={() => addToWishlist(car)}>Add to Wishlist</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="wishlist-section">
        <h2><ThumbsUp size={32} />Wishlist </h2>
        <ul>
          {wishlist.map((wishlistItem, index) => (
            <li key={index}>
              <img src={wishlistItem.image} alt={wishlistItem.name} width={100} height={80} />
              <p>Name: {wishlistItem.name}</p>
              <p>Color: {wishlistItem.color}</p>
              <p>Amount: ${wishlistItem.amount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
