import './style.css'
import $ from 'jquery'
import Toastify from 'toastify-js'
import {API_KEY} from './keys.json'

const search = $('#search');
const form = $('#search-form');
const weatherBox = $('#weather-graphic');
const temperature = $('.temperature p');
const humidity = $('#humidity');
const wind = $('#wind');

form.on("submit", (e) => {
    e.preventDefault();

    const city = search.val();
    if (city == null) {
        console.log("NULL");
        return;
    }

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`,
        method: "GET",
        dataType: "json",
        success: (data) => {            
            temperature.html(Math.round(data.main.temp) + '<sup>&deg;F</sup>');
            const weatherIcon = getWeatherIcon(data.weather[0].main);
            weatherBox.attr('src', `resources/animated/${weatherIcon}`);
            humidity.html(data.main.humidity + '%');
            wind.html(data.wind.speed + ' mp/h');
            console.log(data);
        },
        error: (error) => {
            Toastify({
                text: "API call failed",
                duration: 1000,
                style: {
                    background: "#f03551"
                }
            }).showToast();
            console.log(error);
            console.log(error.status);
        }
    });
})

function getWeatherIcon(weatherCondition) {
    const weatherIconMap = {
        "Clear": "day.svg",
        "Clouds": "cloudy.svg",
        "Thunderstorm": "thunder.svg",
        "Drizzle": "rainy-1.svg",
        "Rain": "rainy-7.svg",
        "Snow": "snowy-6.svg"
    };
    return weatherIconMap[weatherCondition] || "weather.svg";
}

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}