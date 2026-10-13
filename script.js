const apiKey = window.WEATHER_API_KEY || "";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loader = document.getElementById("loader");
const weatherBox = document.getElementById("weatherBox");
const errorMsg = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) { showError("Please enter a city name."); return; }
  getWeatherByCity(city);
});

locationBtn.addEventListener("click", () => {
  getLocationWeather();
});

function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function showError(message) {
  showLoader(false);
  weatherBox.style.display = "none";
  errorMsg.innerText = message;
}

async function requestWeather(url) {
  if (!apiKey) throw new Error("Weather API key is not configured. Create config.js from config.example.js.");
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || Number(data.cod) !== 200) {
    if (Number(data.cod) === 401) throw new Error("Weather API key is invalid or not activated.");
    if (Number(data.cod) === 404) throw new Error("City not found. Check the spelling and try again.");
    throw new Error(data.message || "Unable to retrieve weather right now.");
  }
  return data;
}

async function getWeatherByCity(city) {
  showLoader(true);
  weatherBox.style.display = "none";
  errorMsg.innerText = "";
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}&units=metric`;
    displayWeather(await requestWeather(url));
  } catch (error) {
    showError(error.message || "Network error. Please try again.");
  } finally {
    showLoader(false);
  }
}

function getLocationWeather() {
  if (!navigator.geolocation) { showError("Location is not supported by this browser."); return; }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    showLoader(true);
    errorMsg.innerText = "";
    weatherBox.style.display = "none";
    try {
      const { latitude, longitude } = pos.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${encodeURIComponent(apiKey)}&units=metric`;
      displayWeather(await requestWeather(url));
    } catch (error) {
      showError(error.message || "Could not retrieve location weather.");
    } finally {
      showLoader(false);
    }
  }, (error) => {
    const message = error.code === 1 ? "Location permission was denied." : error.code === 2 ? "Your location could not be determined." : "Location request timed out.";
    showError(message);
  }, { timeout: 10000, maximumAge: 300000 });
}

function displayWeather(data){

  weatherBox.style.display = "block";

  document.getElementById("cityName").innerText = data.name;

  document.getElementById("temp").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("description").innerText =
    data.weather[0].description;

  document.getElementById("feels").innerText =
    Math.round(data.main.feels_like) + "°C";

  document.getElementById("humidity").innerText =
    data.main.humidity + "%";

  document.getElementById("wind").innerText =
    data.wind.speed + " km/h";

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  changeBackground(data.weather[0].main);
}

function changeBackground(weather){

  let body = document.body;

  if(weather === "Clear"){
    body.style.background = "linear-gradient(to right,#fceabb,#f8b500)";
  }
  else if(weather === "Clouds"){
    body.style.background = "linear-gradient(to right,#bdc3c7,#2c3e50)";
  }
  else if(weather === "Rain"){
    body.style.background = "linear-gradient(to right,#4b79a1,#283e51)";
  }
  else{
    body.style.background = "linear-gradient(to right,#74ebd5,#9face6)";
  }
}
