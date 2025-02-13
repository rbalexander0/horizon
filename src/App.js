import './App.css';

import Map from './components/Map';
import CurrentWeather from './components/CurrentWeather';
import CurrentLocation from './components/CurrentLocation';
import DailyForecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import UnitsButton from './components/UnitsButton';

import { useEffect, useState, useMemo } from 'react';

import logo from './logo.png';

const cache = {};

function WeatherApp() {

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState('manhattan');
  const [city, setCity] = useState(null);
  const [units, setUnits] = useState('imperial');
  // TODO: Add setLang functionality
  const [lang, /*setLang*/] = useState('en');

  const [showSearchBox, setShowSearchBox] = useState(false);

  // TODO: Hide API key from inspect
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {

      // Cache weather data by location and units so we don't make too many requests.
      const cacheKey = `${query}_${location}_${units}`;

      if (cache[cacheKey]) {
        setWeatherData(cache[cacheKey]);
      } else {
        // TODO: Add handling of errors
        const api = !location ?
          `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&lang=${lang}&appid=${apiKey}` :
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${units}&lang=${lang}&appid=${apiKey}`

        const response = await fetch(api);
        const data = await response.json();

        cache[cacheKey] = data;
        setWeatherData(data);
        setCity(data.name);
      }
    };

    fetchWeatherData();
  },
    // Update if any of the following change.
    [query, location, units, lang, apiKey]);



  /**
   * Determines the background color gradient based on the current time
   * relative to sunrise and sunset times.
   *
   * @param {Object} timezone - Object containing timezone information.
   * @returns {string} The CSS linear-gradient value representing the background color.
   * 
   * The function checks if the current time is near sunrise or sunset, 
   * during the daytime, or during the nighttime, and returns the appropriate
   * gradient for each case.
   */
  function backgroundColor() {

    // Get the current local hour in 24-hour format
    const date = new Date(Date.now());

    const sunriseTime = new Date(weatherData?.sys.sunrise * 1000);
    const sunsetTime = new Date(weatherData?.sys.sunset * 1000);

    console.log(date, sunriseTime, sunsetTime);

    const diffToSunrise = Math.abs(date.getTime() - sunriseTime.getTime());
    const diffToSunset = Math.abs(date.getTime() - sunsetTime.getTime());

    const nearSunriseMinutes = 45 * (60 * 1000);
    const isNearSunrise = diffToSunrise <= nearSunriseMinutes;
    const isNearSunset = diffToSunset <= nearSunriseMinutes;

    // Sunrise & sunset gradient
    const addNoise = (color, amount) => {
      const r = color[0] + Math.floor(Math.random() * amount * 2 - amount);
      const g = color[1] + Math.floor(Math.random() * amount * 2 - amount);
      const b = color[2] + Math.floor(Math.random() * amount * 2 - amount);
      return `rgb(${r}, ${g}, ${b})`;
    };

    if (isNearSunrise || isNearSunset) {
      return `linear-gradient(to bottom,${addNoise([255, 193, 7], 10)},${addNoise([78, 89, 140], 10)})`;
      // Daytime gradient
    } else if (date > sunriseTime && date < sunsetTime) {
      return `linear-gradient(to bottom,${addNoise([228, 228, 250], 10)},${addNoise([30, 149, 246], 10)})`;
      // Sunset gradient
    } else if (date < sunriseTime || date > sunsetTime) {
      return `linear-gradient(to bottom,${addNoise([78, 89, 140], 10)},${addNoise([47, 53, 66], 10)})`;
    }
  }

  return (
    // eslint-disable-next-line
    <div className="App" style={{ background: useMemo(() => backgroundColor(), [city]) }}>
      <div className='header'>
        <div className='logo-container'>
          <img src={logo} className='logo' alt='logo' />
          <div className='title' >Horizon</div>
        </div>
        <div className='right-side-container'>
          <SearchBar setQuery={
            (query) => {
              setQuery(query);
              // This is needed because location controls whether to use query or location
              setLocation(null);
            }} showSearchBox={showSearchBox} setShowSearchBox={setShowSearchBox}
          />
          <CurrentLocation location={location} setLocation={setLocation} />
          <UnitsButton units={units} onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')} />
        </div>
      </div>
      <div className='content'>
        <div className='city-name'>{city}</div>
        <CurrentWeather data={weatherData} />
        <DailyForecast query={query} location={location} units={units} lang={lang} />
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
