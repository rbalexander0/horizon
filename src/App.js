import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// Displays current info
function CurrentWeather({ data }) {
  {/* Display weather data here */ }
  return (
    <div>{data ?
      (
        <div className='weather-container'>
          <p className='temperature'>Temperature: </p>
          <p className='description'>Condition: </p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}</div>);
}

// // Search bar
// function SearchBar({ onSearch }) {

// }

function WeatherApp() {

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('San Francisco');
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
    };

    fetchWeatherData();
  }, [city])

  return (
    <div className="App">
      {/* <SearchBar onSearch={setCity} /> */}
      <h2 className='city-name'>{city}</h2>
      <CurrentWeather data={weatherData} />
    </div>
  );
}

export default WeatherApp;
