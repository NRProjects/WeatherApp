import $ from 'jquery'
import Toastify from 'toastify-js'
import {API_KEY} from './keys.json'

const search = $('#search');
const form = $('#search-form');
const weatherGraphic = $('#weather-graphic');
const weatherDescription = $('#weather-description')
const temperature = $('.temperature h1');
const feelsLikeTemp = $('#feels-like');
const humidity = $('#humidity');
const wind = $('#wind');
const location = $('#location');

const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

// Forced Uppercase
search.on("input", (e) => {
    search.val(search.val().toUpperCase())
})

// Form submit handling
form.on("submit", (e) => {
    e.preventDefault();
    const city = search.val();

    if (city == "") {
        Toastify({
            text: "Input must not be blank",
            position: "center",
            duration: 1000,
            close: true,
            style: {
                background: '#c79200',
                boxShadow: "0"
            }
        }).showToast();
        return;
    }


    // Save current graphic and start spinner
    let oldWeatherGraphic = weatherGraphic.attr('src');
    weatherGraphic.attr('src', 'resources/animated/spinner.svg')
    
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`,
        method: "GET",
        dataType: "json",
        success: (data) => {            
            // Grabbing icon from Map
            const weatherIcon = getWeatherIcon(data.weather[0].main);

            // Updating view
            weatherGraphic.attr('src', `resources/animated/${weatherIcon}`);
            weatherGraphic.attr('alt', `${data.weather[0].main} Icon`);
            
            temperature.html(Math.round(data.main.temp) + '<sup>&deg;F</sup>');
            feelsLikeTemp.html(`Feels Like: ${Math.round(data.main.feels_like)}<sup>&deg;F</sup>`);
            humidity.html(data.main.humidity + '%');
            wind.html(data.wind.speed + ' mp/h');
            location.html(`${data.name}, ${data.sys.country}`);
            weatherDescription.html(uppercaseWords(data.weather[0].description));

            console.log(data.name, data);
            console.log(data.main.temp)
        },
        error: (error) => {
            Toastify({
                text: "API call failed",
                position: "center",
                duration: 1000,
                style: {
                    background: "#f03551",
                    boxShadow: "0"
                }
            }).showToast();

            // Revert loading spinner
            weatherGraphic.attr('src', oldWeatherGraphic || '')

            console.log(error);
            console.log("Error Code ", error.status);
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