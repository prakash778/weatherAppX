function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let options = { weekday: "long" };
    let day = new Intl.DateTimeFormat("en-US", options).format(date);
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${day} ${hours}:${minutes}`;
  }
  
  /*Changing the  searched city and its temperature */
  function displayCityTemperature(response) {
    //Displaying the searched city
    let cityToChange = document.querySelector("#city-to-change");
    cityToChange.innerHTML = response.data.name;
  
    //Display the searched city's temperature
    let cityTemp = Math.round(response.data.main.temp);
    let tempToDisplay = document.querySelector("#temperature");
    tempToDisplay.innerHTML = cityTemp;
    //celsiusTemperature = cityTemp;
  
    //Display the searched city's date and time
    let dateAndTime = document.querySelector("#datetime-to-change");
    dateAndTime.innerHTML = formatDate(response.data.dt * 1000);
  
    //Display the searched city's weather description
    let descriptionToDisplay = document.querySelector("#description");
    descriptionToDisplay.innerHTML = response.data.weather[0].description;
  
    //Display the searched city's weather icon
    let iconToDisplay = document.querySelector("#weather-icon");
    iconToDisplay.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconToDisplay.setAttribute("alt", response.data.weather[0].description);
  
    //Display the searched city's weather precipitation, humidity, wind speed
    let humidity = document.querySelector("#humidity");
    let windSpeed = document.querySelector("#wind");
    humidity.innerHTML = response.data.main.humidity;
    windSpeed.innerHTML = Math.round(response.data.wind.speed);
  
    getForecast(response.data.coord);
  }
  
  function getInput(event) {
    event.preventDefault();
    let input = document.querySelector("#search-input");
    let city = input.value;
    city = city.toLowerCase().trim();
    if (/[a-z]/gi.test(city) === false) {
      alert("Please type in a city");
    } else {
      //getting the searched city's temperature
      search(city);
    }
  }
  
  function search(city) {
    let apiKey = "863238029d9dfa4b08aae7c3cedb56d6";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayCityTemperature);
  }
  
  //use the user's device location and  make the weather in that place Default
  function getCity(response) {
    let city = response.data.name;
    search(city);
  }
  
  function getPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = "863238029d9dfa4b08aae7c3cedb56d6";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    axios.get(apiUrl).then(getCity);
  }
  let userLocation = navigator.geolocation.getCurrentPosition(getPosition);
  
  // User types in a city and clicks the submit button
  const searchButton = document.querySelector("#searchButton");
  searchButton.addEventListener("click", getInput);
  
  /*
  let celsiusTemperature = null;
  
  Converting the temperature units
  
  function toCelsius(event) {
    event.preventDefault();
  
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = Math.round(celsiusTemperature);
  
    changing the color of the unit links
    convertToCelsius.classList.remove("text-dark");
    convertToCelsius.classList.add("text-primary");
    convertToFahrenheit.classList.remove("text-primary");
    convertToFahrenheit.classList.add("text-dark");
  }
  
  function toFahrenheit(event) {
    event.preventDefault();
    let converted = celsiusTemperature * 1.8 + 32;
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = Math.round(converted);
  
    changing the color of the unit links
    convertToCelsius.classList.remove("text-primary");
    convertToCelsius.classList.add("text-dark");
    convertToFahrenheit.classList.remove("text-dark");
    convertToFahrenheit.classList.add("text-primary");
  }
  
  let convertToCelsius = document.querySelector("#celsius");
  convertToCelsius.addEventListener("click", toCelsius);
  
  let convertToFahrenheit = document.querySelector("#fahrenheit");
  convertToFahrenheit.addEventListener("click", toFahrenheit);
  */
  
  //Weather forecast
  
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }
  
  function displayForecast(response) {
    let forecastToDisplay = document.querySelector("#forecast");
    let forecastHTML = `<div class="next-5-days mt-4">`;
    let forecast = response.data.daily;
  
    forecast.forEach(function (forecastDay, index) {
      if (index < 5) {
        forecastHTML += `<div class="each-day">
      <p class="m-0">${formatDay(forecastDay.dt)}</p>
      <img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" alt="weather icon" class="icons">
      <p>${Math.round(
        forecastDay.temp.max
      )}° <span class="temp-min-forecast">${Math.round(
          forecastDay.temp.min
        )}°</span></p>
    </div>`;
      }
    });
    forecastHTML += `</div>`;
    forecastToDisplay.innerHTML = forecastHTML;
  }
  
  function getForecast(coordinates) {
    let apiKey = "9e0fb79c2f66d0cd0dcf06710976a873";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  }