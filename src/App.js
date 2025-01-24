import './App.css';
import Map from './components/Map';
import CurrentWeather from './components/CurrentWeather';
import CurrentLocation from './components/CurrentLocation';
import { useEffect, useState } from 'react';
import logo from './logo.png';

// TODO: Add search bar

function WeatherApp() {

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [usingQuery, setUsingQuery] = useState(true);
  const [query, setQuery] = useState('Manhattan');
  const [city, setCity] = useState(null);
  // TODO: Add setUnits functionality
  const [units, setUnits] = useState('imperial');
  // TODO: Add setLang functionality
  const [lang, setLang] = useState('en');

  // TODO: Hide API key from inspect
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      // TODO: Add handling of errors

      const api = usingQuery ?
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&lang=${lang}&appid=${apiKey}` :
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${units}&lang=${lang}&appid=${apiKey}`

      const response = await fetch(api);
      const data = await response.json();

      setWeatherData(data);
      setCity(data.name);
    };

    fetchWeatherData();
  },
    // Update if any of the following change.
    [query, location, units, lang, apiKey]);

  return (
    <div className="App">
      <div className='header'>
        <div className='logo-container'>
          <img src={logo} className='logo' alt='logo' />
          <div className='title'>Horizon</div>
        </div>
        <CurrentLocation location={location} setLocation={setLocation} setUsingQuery={setUsingQuery} />
      </div>
      <div className='content'>
        <div className='city-name'>{city}</div>
        <CurrentWeather data={weatherData} />
        {/* TODO: Add forecast section */}
        <Map
          // Prefer to use current location if specified
          // TODO: Make fetchWeatherData also set location so we don't have to do this
          lat={location?.coords.latitude || weatherData?.coord.lat}
          lon={location?.coords.longitude || weatherData?.coord.lon} />
      </div>
    </div >
  );
}

export default WeatherApp;
