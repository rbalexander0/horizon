import './App.css';
import Map from './components/Map';
import CurrentWeather from './components/CurrentWeather';
import CurrentLocation from './components/CurrentLocation';
import DailyForecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import { useEffect, useState } from 'react';
import logo from './logo.png';
import UnitsButton from './components/UnitsButton';

// TODO: Add search bar

const cache = {};

function WeatherApp() {

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState('south lake tahoe');
  const [city, setCity] = useState(null);
  const [units, setUnits] = useState('imperial');
  // TODO: Add setLang functionality
  const [lang, /*setLang*/] = useState('en');

  // TODO: Hide API key from inspect
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {

      // Cache weather data by location and units so we don't make too many requests.
      const cacheKey = `${query}_${units}`;

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
   * Generates a background gradient color based on the time of day
   * at the given timezone.
   * 
   * @param {Object} params - Object containing the timezone to use.
   * @param {number} params.timezone - The timezone offset in seconds.
   * 
   * @returns {string} A linear gradient background string in CSS format.
   * 
   * The gradient changes based on the time of day at the given timezone.
   * The colors are:
   * - Nighttime (9pm - 6am): #4E598C to #2F3542
   * - Sunrise (6am - 9am): #FFC107 to #4E598C
   * - Daytime (9am - 6pm): #F4F4FA to #1E90FF
   * - Sunset (6pm - 9pm): #FFC107 to #4E598C
   */
  function backgroundColor({ timezone }) {

    // Get the current local hour in 24-hour format
    const hour = new Date(Date.now() + (weatherData?.timezone * 1000)).getUTCHours();

    // TODO: Refactor this function to use actual sunrise and sunset times
    // Nighttime gradient
    if (hour >= 21 || hour < 6) {
      return `linear-gradient(to bottom, #4E598C, #2F3542)`;
      // Sunrise gradient
    } else if (hour >= 6 && hour < 9) {
      return `linear-gradient(to bottom, #FFC107, #4E598C)`;
      // Daytime gradient
    } else if (hour >= 9 && hour < 18) {
      return `linear-gradient(to bottom,rgb(228, 228, 250),rgb(30, 149, 246))`;
      // Sunset gradient
    } else if (hour >= 18 && hour < 21) {
      return `linear-gradient(to bottom, #FFC107, #4E598C)`;
    }
  }

  return (
    <div className="App" style={{ background: backgroundColor({ timezone: weatherData?.timezone }) }}>
      <div className='header'>
        <div className='logo-container'>
          <img src={logo} className='logo' alt='logo' />
          <div className='title'>Horizon</div>
        </div>
        <div className='right-side-container'>
          <SearchBar query={query} setQuery={
            (query) => {
              setQuery(query);
              // This is needed because location controls whether to use query or location
              setLocation(null);
            }
          } />
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
