import React, { useEffect, useState } from "react";
import "./App.css";
import sunnyvid from "./assets/sunny.mp4";
import cloudyvid from "./assets/cloudy.mp4";
import rainvid from "./assets/rain.mp4";
import mistvid from "./assets/mist.mp4";
import hazevid from "./assets/haze.mp4";

import sunnyimg from "./assets/sunny.jpg";
import cloudyimg from "./assets/cloudy.jpg";
import rainimg from "./assets/rainny.jpg";
import mistimg from "./assets/mist.jpg";
import hazeimg from "./assets/hazyy.jpeg";

import sunwhite from "./assets/sun-white.png";
import mistLogo from "./assets/mist-logo.png";
import cloudLogo from "./assets/cloud-logo.png";

import boxClearImg from "./assets/sun.jpg";
import boxCloudyImg from "./assets/box-cloudy.jpeg";
import boxRainImg from "./assets/box-rain.jpg";
import boxMistImg from "./assets/box-mist.jpeg";
import boxHazeImg from "./assets/box-haze.jpeg";

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
    Haze: { video: hazevid, img: hazeimg },
  };

  // Weather condition to box image mapping (separate images)
  const weatherBoxMedia = {
    Clear: boxClearImg,
    Clouds: boxCloudyImg,
    Rain: boxRainImg,
    Mist: boxMistImg,
    Haze: boxHazeImg,
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getWeather(); // Call getWeather when Enter is pressed
    }
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
      <main className="min-h-screen flex flex-col">
        <header className="relative z-20">
          <nav className="absolute top-2 max-[639px]:top-1 sm:top-4 md:top-5 left-2 max-[639px]:left-1 sm:left-4 md:left-5 font-bold text-base max-[639px]:text-sm sm:text-xl md:text-2xl lg:text-3xl text-gray-800 max-[639px]:z-30">
            ELEMENTAL <span className="text-blue-500">VIEW</span>
          </nav>
        </header>

        <div className="hero relative w-full h-screen flex items-center justify-center">
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
          <div className="box bg-black/60 backdrop-blur-[25px] rounded-3xl shadow-2xl border border-white/20 h-[95vh] max-[639px]:h-[93vh] sm:h-[85vh] md:h-[80vh] w-[95vw] max-[639px]:w-[98vw] sm:w-[85vw] md:w-[80vw] lg:w-[60vw] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-3xl flex flex-col sm:flex-row items-center justify-center z-20">
            <div className="left-box h-[35vh] max-[639px]:h-[45vh] sm:h-[85vh] md:h-[80vh] w-full sm:w-[50%] lg:w-[58%] relative rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none">
              {/* Dynamic box image based on weather */}
              <img
                src={selectedBoxImg}
                alt="Weather Box Image"
                className="object-cover h-full w-full rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none"
              />
              <div className="absolute bottom-2 max-[639px]:bottom-1 sm:bottom-4 md:bottom-5 left-2 max-[639px]:left-1 sm:left-4 md:left-5 text-white text-xs max-[639px]:text-[10px] sm:text-sm md:text-base lg:text-lg font-mono px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg">
                {currentTime}
              </div>
            </div>

            <div className="right-box h-[60vh] max-[639px]:h-[50vh] sm:h-[85vh] md:h-[80vh] w-full sm:w-[50%] lg:w-[42%] rounded-b-3xl sm:rounded-r-3xl sm:rounded-bl-none flex flex-col items-center">
              <div className="logo w-full h-[15vh] max-[639px]:h-[18vh] sm:h-[20vh] rounded-tr-3xl flex flex-col items-center mt-2 sm:mt-4">
                {/* Dynamic Logo based on weather */}
                <img
                  src={selectedLogo}
                  alt="Weather Logo"
                  className="object-contain mt-1 max-[639px]:mt-2 sm:mt-3 h-[7vh] max-[639px]:h-[8vh] sm:h-[10vh] md:h-[12vh] lg:h-[15vh] w-[20vw] max-[639px]:w-[25vw] sm:w-[20vw] md:w-[15vw]"
                />
                <div className="logo-text text-white text-center text-lg max-[639px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 max-[639px]:mt-3 sm:mt-4 md:mt-5 font-bold border-b-2 border-white">
                  {weatherData?.weather[0]?.main || "SUNNY"}
                </div>

                <div className="city-name text-center text-white font-bold mt-1 sm:mt-2 text-xs max-[639px]:text-[10px] sm:text-sm md:text-base">
                  {weatherData?.name?.toUpperCase()},{" "}
                  {weatherData?.sys?.country || "IN"}
                </div>

                <div className="city-search flex flex-row items-center justify-between bg-transparent w-[90%] max-[639px]:w-[95%] sm:w-[80%] md:w-[90%] h-[7vh] max-[639px]:h-[8vh] sm:h-[10vh] p-1 rounded-xl border border-gray-400 mt-2">
                  {/* Search Input */}
                  <input
                    type="search"
                    placeholder="Search city"
                    className="h-[5vh] sm:h-[6vh] w-[75%] px-2 sm:px-3 md:px-4 rounded-l-full text-white bg-transparent border-none outline-none text-xs max-[639px]:text-[10px] sm:text-sm md:text-base"
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />

                  {/* Search Icon */}
                  <div className="search-icon h-[5vh] sm:h-[6vh] w-[15%] flex items-center justify-center bg-transparent cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="rgba(255,255,255,1)"
                      className="h-3 w-3 max-[639px]:h-4 max-[639px]:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                      onClick={getWeather}
                    >
                      <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                    </svg>
                  </div>
                </div>

                <div className="details flex flex-col items-center justify-between mt-2 max-[639px]:mt-3 sm:mt-4 md:mt-5 gap-1 max-[639px]:gap-2 sm:gap-3 md:gap-4 w-full px-2 sm:px-3 md:px-4">
                  <div className="temp text-center text-white font-bold w-full bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center p-1 text-[10px] max-[639px]:text-xs sm:text-sm md:text-base">
                    <span className="block">Temperature</span>
                    <span>{weatherData?.main?.temp || "25"}°C</span>
                  </div>
                  <div className="humidity text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center text-[10px] max-[639px]:text-xs sm:text-sm md:text-base">
                    <span className="block">Humidity</span>
                    <span>{weatherData?.main?.humidity || "50"}%</span>
                  </div>
                  <div className="visibility text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center text-[10px] max-[639px]:text-xs sm:text-sm md:text-base">
                    <span className="block">Visibility</span>
                    <span>{weatherData?.visibility / 1000 || "10"} km</span>
                  </div>
                  <div className="wind-speed text-center text-white font-bold w-full p-1 bg-black/50 rounded-lg border-t-4 border-gray-500 shadow-lg flex justify-around items-center text-[10px] max-[639px]:text-xs sm:text-sm md:text-base">
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
            <div className="text-white text-sm max-[639px]:text-base sm:text-lg md:text-xl lg:text-2xl">
              Getting your location...
            </div>
          </div>
        )}
        {geoError && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="text-white text-sm max-[639px]:text-base sm:text-lg md:text-xl lg:text-2xl bg-red-500 p-2 sm:p-3 md:p-4 rounded-lg">
              {geoError}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
