import { useState, useEffect } from 'react'
import waterDroplet from '/static/droplet-solid.svg'
import windGust from '/static/wind-solid.svg'
import Toastify from 'toastify-js'
import { API_KEY } from '../keys.json'
import './App.css'

const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

function getWeatherIcon(weatherCondition) {
  const weatherIconMap = {
      "Clear": "animated/day.svg",
      "Clouds": "animated/cloudy.svg",
      "Thunderstorm": "animated/thunder.svg",
      "Drizzle": "animated/rainy-1.svg",
      "Rain": "animated/rainy-7.svg",
      "Snow": "animated/snowy-6.svg"
  };
  return weatherIconMap[weatherCondition] || "animated/weather.svg";
}

function App() {
  const [search, setSearch] = useState("ENTER LOCATION");
  const [weather, setWeather] = useState({
    temperature:"0",
    graphic: "",
    graphicAlt: "",
    feelsLikeTemp:"",
    humidity:"0",
    wind:"0",
    location:"",
    weatherDescription:"",
  })
  let handleSubmit = (e) => { 
    e.preventDefault();
    console.log(search)
    if (search == "") {
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
        console.log("Empty")
        return;
    }
  
  // Save current graphic and start spinner
  let oldWeatherGraphic = weather.graphic;
  setWeather({ ...weather, graphic: "animated/spinner.svg"});
  
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=imperial`)
    .then((response) => {
      if (!response.ok) {
        throw Error("Could not resolve");
      }
      return response.json()
    })
    .then(
      (data) => {
        console.log(data)
        
        setWeather({
          graphic: getWeatherIcon(data.weather[0].main),
          graphicAlt: `${data.weather[0].main} Icon`,
          temperature: Math.round(data.main.temp),
          feelsLikeTemp: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: data.wind.speed,
        location: `${data.name}, ${data.sys.country}`,
        weatherDescription: uppercaseWords(data.weather[0].description),
        })
        
      },
      (error) => {
        Toastify({
          text: "API call failed",
          position: "center",
          duration: 1000,
          style: {
            background: "#f03551",
            boxShadow: "0"
        }
      }).showToast();
        setWeather({ ...weather, graphic: oldWeatherGraphic});
      }
    ).catch(err => {
      console.log(err)
    }
      
    )
  }  

  return (
    <div className="center">
      <div className="container">
        <div className="search">
          <form id="search-form" onSubmit={handleSubmit}>
            <input 
            id="search" 
            type="text"
            placeholder={search} 
            onChange={(event) => {setSearch(event.target.value); }}/>
            <input type="submit" />
          </form>
          <div id="location" className="weight-thin gray">{weather.location}</div>
        </div>
        <div className="weather-box">
          <img id="weather-graphic" src={weather.graphic} alt={weather.graphicAlt}/>
          <p id="weather-description" className="weight-thin gray">{weather.weatherDescription}</p>
        </div>
        <div className="temperature">
          <h1 id="temp-value">{weather.temperature}<sup>&deg;F</sup></h1>
          <p id="feels-like" className="weight-thin gray">Feels Like: {Math.round(weather.feelsLikeTemp)} <sup>&deg;F</sup></p>
        </div>
        <div className="humidity">
          <img src={waterDroplet} alt="Water Droplet"/>
          <p id="humidity">{weather.humidity}%</p>
          <p className="humidity-label">Humidity</p>
        </div>
        <div className="wind">
          <img src={windGust} alt="Wind Gust"/>
          <p id="wind">{weather.wind} mp/h</p>
          <p className="wind-label">Wind Speed</p>
        </div>
      </div>
    </div>
  )
}

export default App
