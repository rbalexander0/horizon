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
  const [city, setCity] = useState('San Francisco');
  // TODO: Add setUnits functionality
  const [units, setUnits] = useState('imperial');
  // TODO: Add setLang functionality
  const [lang, setLang] = useState('en');

  // TODO: Hide API key from inspect
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      // TODO: Add handling of errors
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
    };

    fetchWeatherData();
  }, [city])

  return (
    <div className="App">
      <div className='header'>
        <div className='logo-container'>
          <img src={logo} className='logo' alt='logo' />
          <div className='title'>Horizon</div>
        </div>
        <CurrentLocation location={location} setLocation={setLocation} />
      </div>
      <div className='content'>
        <div className='city-name'>{city}</div>
        <CurrentWeather data={weatherData} />
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
