const apiKey = "c4c3eee3d27378191c28121232c01ccc";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loader = document.getElementById("loader");
const weatherBox = document.getElementById("weatherBox");
const errorMsg = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  let city = document.getElementById("cityInput").value;
  if (city !== "") getWeatherByCity(city);
});

locationBtn.addEventListener("click", () => {
  getLocationWeather();
});

function showLoader(show){
  loader.style.display = show ? "block" : "none";
}

function getWeatherByCity(city){

  showLoader(true);
  weatherBox.style.display = "none";
  errorMsg.innerText = "";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {

      showLoader(false);

      if(data.cod !== 200){
        errorMsg.innerText = "City not found ❌";
        return;
      }

      displayWeather(data);
    })
    .catch(()=>{
      showLoader(false);
      errorMsg.innerText = "Network error ❗";
    });
}

function getLocationWeather(){

  if(!navigator.geolocation){
    alert("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {

    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    showLoader(true);

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {

        showLoader(false);
        displayWeather(data);

      });

  });
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
