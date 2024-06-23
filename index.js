const searchButton = document.querySelector('#search-btn');
const cityInput = document.querySelector('#search-bar');
const weatherCardsDiv = document.querySelector('.weekly-weather');
const currentWeatherDiv = document.querySelector('.current-weather-pic');

const API_KEY = "77a8bd5126fa0dd3a61724813f56f6a1";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div id="current-weather" class="current-weather">
                    <h1>${(Math.round(weatherItem.main.temp - 273.15))}° C</h1>
                    <h4>Wind: ${(weatherItem.wind.speed * 3.6).toFixed(2)} km/h</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    <h3 class="date">${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <h3 class="place">${cityName}</h3>
                </div>

                <div id="current-weather-logo" class="current-weather-logo">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-condition">
                    <h3>${weatherItem.weather[0].description}</h3>
                </div>`;
    } else{
        return `<li class="weekly">
                    <h1 class="weekly-date">${weatherItem.dt_txt.split(" ")[0]}</h1>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                    <h1 class="temperature">${(Math.round(weatherItem.main.temp - 273.15))}°C</h1>
                    <h4>Wind: ${(weatherItem.wind.speed * 3.6).toFixed(2)} km/h</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index ) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }

        })
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!")
    })
}

searchButton.addEventListener('click', getCityCoordinates);