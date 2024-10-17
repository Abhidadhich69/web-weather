import React, { useEffect, useState } from "react";
import "./App.css";
import sunnyvid from "./assets/sunny.mp4";
import cloudyvid from "./assets/cloudy.mp4";
import rainvid from "./assets/rain.mp4";
import mistvid from "./assets/mist.mp4";

import sunnyimg from "./assets/sunny.jpg";
import cloudyimg from "./assets/cloudy.jpg";
import rainimg from "./assets/rainny.jpg";
import mistimg from "./assets/mist.jpg";

import sunwhite from "./assets/sun-white.png";
import mistLogo from "./assets/mist-logo.png";
import cloudLogo from "./assets/cloud-logo.png";

import boxClearImg from "./assets/sun.jpg";
import boxCloudyImg from "./assets/box-cloudy.jpeg";
import boxRainImg from "./assets/box-rain.jpg";
import boxMistImg from "./assets/box-mist.jpeg";

function App() {
  const [currentTime, setCurrentTime] = useState("");
  const [city, setCity] = useState("Ajmer"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchCity, setSearchCity] = useState(""); // State to handle search input
  const [cityName, setCityName] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [geoError, setGeoError] = useState(null);

  const API_KEY = "1bf526149dfc37e7d68ddedef73991a8";

  // Function to fetch weather data
  const fetchWeatherData = async (lat, lon, cityName = null) => {
    try {
      const apiUrl = cityName
        ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeatherData(data);
      setCity(data.name); // Update city name from API
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  // Handle search form submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchCity) {
      fetchWeatherData(null, null, searchCity); // Fetch weather by city name
    }
  };

  // Get the current time and update every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true); // Show loading overlay
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGeoError(null);
          setIsLoadingLocation(false);
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);
        },
        (error) => {
          let errorMsg = "An error occurred while getting your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Please enable location services to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is currently unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "Getting location timed out. Please try again.";
              break;
          }
          setGeoError(errorMsg);
          console.error(errorMsg);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 } // Modified settings
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
    }
  }, []);

  // Fetch weather data when latitude and longitude are available
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    } else if (geoError) {
      // Fallback to default city
      fetchWeatherData(null, null, "Ajmer");
    }
  }, [latitude, longitude, geoError]);

  // Weather condition to media mapping for background
  const weatherMedia = {
    Clear: { video: sunnyvid, img: sunnyimg },
    Clouds: { video: cloudyvid, img: cloudyimg },
    Rain: { video: rainvid, img: rainimg },
    Mist: { video: mistvid, img: mistimg },
  };

  // Weather condition to box image mapping (separate images)
  const weatherBoxMedia = {
    Clear: boxClearImg,
    Clouds: boxCloudyImg,
    Rain: boxRainImg,
    Mist: boxMistImg,
  };

  // Weather condition to logo mapping
  const weatherLogoMedia = {
    Clear: sunwhite,
    Clouds: cloudLogo,
    Mist: mistLogo,
  };

  // Determine media based on weather
  const currentWeather = weatherData?.weather[0]?.main || "Clear";
  const selectedMedia = weatherMedia[currentWeather] || weatherMedia["Clear"];
  const selectedBoxImg =
    weatherBoxMedia[currentWeather] || weatherBoxMedia["Clear"];
  const selectedLogo =
    weatherLogoMedia[currentWeather] || weatherLogoMedia["Clear"];

  const handleInputChange = (event) => {
    setCityName(event.target.value);
  };

  const getWeather = async () => {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setWeatherData(data);
        setCity(data.name);
      } else {
        console.error("City not found");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  return (
    <>
      <main className="min-h-screen flex flex-col ">
        <header className="relative z-20">
          <nav className="absolute top-5 left-5 font-bold text-[1.5rem] text-gray-800">
            ELEMENTAL <span className="text-blue-500">VIEW</span>
          </nav>
        </header>

        <div className="hero relative w-screen h-screen flex items-center justify-center">
          {/* Background Video */}
          <video
            key={selectedMedia.video}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={selectedMedia.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Image Overlay */}
          <img
            src={selectedMedia.img}
            alt="Overlay"
            className="absolute z-10 transition-opacity duration-300 ease-in-out hover:opacity-0 w-full h-full object-cover"
          />

          {/* Box */}
          <div className="box bg-black/60 backdrop-blur-[25px] rounded-3xl shadow-2xl border border-white/20 h-[80vh] w-[60vw] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl flex items-center justify-center z-20">
            <div className="left-box h-[80vh] w-[35vw] relative rounded-l-3xl">
              {/* Dynamic box image based on weather */}
              <img
                src={selectedBoxImg}
                alt="Weather Box Image"
                className="object-cover h-[80vh] w-[35vw] rounded-l-3xl"
              />
              <div className="absolute bottom-5 left-5 text-white text-lg font-mono px-4 py-2 rounded-lg">
                {currentTime}
              </div>
            </div>

            <div className="right-box h-[80vh] w-[25vw] rounded-r-3xl flex flex-col items-center ">
              <div className="logo w-[25vw] h-[20vh] rounded-tr-3xl flex flex-col items-center mt-4">
                {/* Dynamic Logo based on weather */}
                <img
                  src={selectedLogo}
                  alt="Weather Logo"
                  className="object-contain mt-3 h-[15vh] w-[15vw]"
                />
                <div className="logo-text text-white text-center text-[2.5rem] mt-5 font-bold border-b-2 border-white">
                  {weatherData?.weather[0]?.main || "SUNNY"}
                </div>

                <div className="city-name text-center text-white font-bold mt-2">
                  {weatherData?.name?.toUpperCase()},{" "}
                  {weatherData?.sys?.country || "IN"}
                </div>

                <div className="city-search flex flex-row items-center justify-between bg-transparent w-[22vw] h-[10vw] p-1 rounded-xl border border-gray-400">
                  {/* Search Input */}
                  <input
                    type="search"
                    placeholder="Search city"
                    className="h-[6vh] w-[75%] px-4 rounded-l-full text-white bg-transparent border-none outline-none"
                    onChange={handleInputChange}
                  />

                  {/* Search Icon */}
                  <div className="search-icon h-[6vh] w-[10%] flex items-center justify-center bg-transparent cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="rgba(255,255,255,1)"
                      className="h-6 w-6"
                      onClick={getWeather}
                    >
                      <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                    </svg>
                  </div>
                </div>

                <div className="details flex flex-col items-center justify-between mt-5 gap-4 w-full px-4">
                  <div className="temp text-center text-white font-bold w-full bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center p-1">
                    <span className="block">Temperature</span>
                    <span>{weatherData?.main?.temp || "25"}°C</span>
                  </div>
                  <div className="humidity text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center">
                    <span className="block">Humidity</span>
                    <span>{weatherData?.main?.humidity || "50"}%</span>
                  </div>
                  <div className="visibility text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center">
                    <span className="block">Visibility</span>
                    <span>{weatherData?.visibility / 1000 || "10"} km</span>
                  </div>
                  <div className="wind-speed text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center">
                    <span className="block">Wind Speed</span>
                    <span>{weatherData?.wind?.speed || "15"} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoadingLocation && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="text-white text-2xl">Getting your location...</div>
          </div>
        )}
        {geoError && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="text-white text-2xl bg-red-500 p-4 rounded-lg">
              {geoError}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
