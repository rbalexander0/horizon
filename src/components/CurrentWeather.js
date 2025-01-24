import './CurrentWeather.css';

/**
 * Component to display current temperature info in a card.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing temperature and other weather details.
 * @returns {JSX.Element} The JSX code to display current temperature information.
 */
function TemperatureCard({ data }) {
    return (
        <div className='temperature-card'>
            <div className='temperature-current'>{Math.trunc(data.main.temp)}°</div>
            {/* <p>Feels Like: {Math.trunc(data.main.feels_like)}°</p> */}
            <p className='condition'>{data.weather[0].main}</p>
            <div className='temperature-high-low'>H:{Math.trunc(data.main.temp_max)}° L: {Math.trunc(data.main.temp_min)}°</div>

        </div>
    )
}

/**
 * Component to display sunrise and sunset times in a card.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing sunrise and sunset times in seconds since epoch.
 * @returns {JSX.Element} The JSX code to display sunrise and sunset times.
 */
function SunriseSunsetCard({ data }) {
    return (
        <div className='weather-card'>
            <p>Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
            <p>Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
        </div>
    )
}

/**
 * Component to display wind speed and direction in a card.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing wind speed and direction in degrees.
 * @returns {JSX.Element} The JSX code to display wind information.
 */
function WindCard({ data }) {
    const getWindDirection = (deg) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.floor((deg + 11.25) / 22.5);
        return directions[index % 16];
    };

    return (
        <div className='weather-card'>
            {/* TODO: Add units var based on user selection */}
            <p>Wind Speed: {Math.trunc(data.wind.speed)} MPH</p>
            <p>Wind Direction: {getWindDirection(data.wind.deg)}</p>
        </div>
    );
}

/**
 * Component to display other weather information.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing humidity, pressure, and visibility.
 * @returns {JSX.Element} The JSX code to display other weather information.
 */
function OtherInfoCard({ data }) {
    return (
        <div className='weather-card'>
            <p className='description'>Humidity: {data.main.humidity}%</p>
            <p className='description'>Pressure: {data.main.pressure}</p>
            <p className='description'>Visibility: {data.visibility}</p>
        </div>
    )
}


// Displays current info
/**
 * Component to display current weather information.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing temperature and other weather details.
 * @returns {JSX.Element} The JSX code to display current weather information.
 */
function CurrentWeather({ data }) {
    return (
        <div>{data ?
            (
                <div className='weather-container'>
                    {/* TODO: Add units var based on user selection */}
                    {/* TODO: Clean this up and make it look nicer */}
                    {/* TODO: For fun: add LLM summary of current weather */}
                    <TemperatureCard data={data} />
                    {/* <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt={data.weather[0].description} /> */}
                    <div className='weather-card-container'>
                        <SunriseSunsetCard data={data} />
                        <WindCard data={data} />
                        <OtherInfoCard data={data} />
                    </div>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}</div>);
}

export default CurrentWeather;