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
        // data: {
        //     q: city,
        //     appid: API_KEY
        // },
        method: "GET",
        dataType: "json",
        success: (data) => {            
            temperature.html(Math.round(data.main.temp) + '<sup>&deg;F</sup>');
            humidity.html(data.main.humidity + '%');
            wind.html(data.wind.speed + ' mp/h');
            console.log(data);

            switch(data.weather[0].main) {
                case "Clear":
                    weatherBox.attr('src', 'resources/animated/day.svg');
                    break;

                case "Clouds":
                    weatherBox.attr('src', 'resources/animated/cloudy.svg');
                    break;

                case "Thunderstorm":
                    weatherBox.attr('src', 'resources/animated/thunder.svg');
                    break;

                case "Drizzle":
                    weatherBox.attr('src', 'resources/animated/rainy-1.svg');
                    break;

                case "Rain":
                    weatherBox.attr('src', 'resources/animated/rainy-7.svg');
                    break;

                case "Snow":
                    weatherBox.attr('src', 'resources/animated/snowy-6.svg');
                    break;

                default:
                    weatherBox.attr('src', 'resources/animated/weather.svg');
                    break;
            }
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

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}