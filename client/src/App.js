import './App.css';
import Map from './components/Map';
import CurrentWeather from './components/CurrentWeather';
import CurrentLocation from './components/CurrentLocation';
import DailyForecast from './components/Forecast';
import { useEffect, useState } from 'react';
import logo from './logo.png';

// TODO: Add search bar

function WeatherApp() {

  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [query, /*setQuery*/] = useState('Manhattan');
  const [city, setCity] = useState(null);
  // TODO: Add setUnits functionality
  const [units, /*setUnits*/] = useState('imperial');
  // TODO: Add setLang functionality
  const [lang, /*setLang*/] = useState('en');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Default to local

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // TODO: fix this to use proxy routes so we don't have to use localhost
        const api = !location ?
          `${apiUrl}/api/weather?city=${query}&units=${units}&lang=${lang}` :
          `${apiUrl}/api/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${units}&lang=${lang}`;

        const response = await fetch(api);
        const data = await response.json();

        setWeatherData(data);
        setCity(data.name);

      } catch (error) {
        console.error("Error fetching weather data:", error);
        // TODO: Add handling of errors
        // Handle error, e.g., display a notification to the user
      }
    };

    fetchWeatherData();
  },
    // Update if any of the following change.
    [query, location, units, lang]);

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
        <CurrentLocation location={location} setLocation={setLocation} />
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
