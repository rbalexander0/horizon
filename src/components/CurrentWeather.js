import './CurrentWeather.css';

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
                    <p className='temperature'>Temperature: {Math.trunc(data.main.temp)}</p>
                    <p className='temperature'>High: {Math.trunc(data.main.temp_max)}</p>
                    <p className='temperature'>Low: {Math.trunc(data.main.temp_min)}</p>
                    <p className='temperature'>Feels Like: {Math.trunc(data.main.feels_like)}</p>
                    <p className='description'>Condition: {data.weather[0].main}</p>
                    <p className='description'>Condition Description: {data.weather[0].description}</p>
                    <p className='description'>Humidity: {data.main.humidity}%</p>
                    <p className='description'>Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
                    <p className='description'>Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
                    <p className='description'>Pressure: {data.main.pressure}</p>
                    <p className='description'>Visibility: {data.visibility}</p>
                    <p className='description'>Clouds: {data.clouds.all}</p>
                    <p className='description'>Wind: {Math.trunc(data.wind.speed)}</p>
                    <p className='description'>Wind Direction: {(() => {
                        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
                        const index = Math.floor((data.wind.deg + 11.25) / 22.5);
                        return directions[index % 16];
                    })()}</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}</div>);
}

export default CurrentWeather;