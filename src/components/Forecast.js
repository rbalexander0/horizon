import './Forecast.css';
import { useEffect, useState } from 'react';

/**
 * Component to display a forecast card.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.forecastData - Weather forecast data object containing a list of forecasts.
 * 
 * @returns {JSX.Element} The JSX code to display the forecast card.
 */
function ForecastCard({ forecastData }) {

    const [dailyForecast, setDailyForecast] = useState({});
    const [dailyForecastMinMax, setDailyForecastMinMax] = useState({});

    // Because I don't want to pay for the daily forecast API, I'm going to aggregate the 3-hourly forecast data.
    // On mount, aggregate the data into a daily format.
    useEffect(() => {
        if (forecastData) {
            const dailyForecastObj = {};

            forecastData.list.forEach(forecast => {
                const dateString = forecast.dt_txt.split(' ')[0];
                if (!dailyForecastObj[dateString]) {
                    dailyForecastObj[dateString] = {
                        min: forecast.main.temp_min,
                        max: forecast.main.temp_max,
                        dt_txt: forecast.dt_txt
                    };
                } else {
                    // Aggregate the min and max temperatures
                    dailyForecastObj[dateString].min = Math.min(dailyForecastObj[dateString].min, forecast.main.temp_min);
                    dailyForecastObj[dateString].max = Math.max(dailyForecastObj[dateString].max, forecast.main.temp_max);
                }
            });

            setDailyForecast(dailyForecastObj);
        }
    }, [forecastData]);

    // On mount, calculate the min and max temperature for each day.
    useEffect(() => {
        if (Object.keys(dailyForecast).length > 0) {
            const min = Math.min(...Object.values(dailyForecast).map(day => day.min));
            const max = Math.max(...Object.values(dailyForecast).map(day => day.max));

            setDailyForecastMinMax({ min, max });
        }
    }, [dailyForecast]);

    return (
        <div className='forecast-card'>
            {Object.keys(dailyForecast).map(date => (
                <ForecastRow
                    key={date}
                    date={date}
                    dailyForecast={dailyForecast[date]}
                    forecastMinMax={dailyForecastMinMax}
                />
            ))}
        </div>
    )
}

/**
 * A ForecastRow component that displays a row in the forecast card.
 * 
 * The component displays the day of the week (short form) and a ForecastBar
 * component representing the min and max temperatures for that day.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.date - The date string in the format 'YYYY-MM-DD'.
 * @param {Object} props.dailyForecast - An object containing the min and max temperatures for the day.
 * @param {Object} props.forecastMinMax - An object containing the min and max temperatures over the entire forecast period.
 * @returns {JSX.Element} The JSX code to display a forecast row.
 */
function ForecastRow({ date, dailyForecast, forecastMinMax }) {

    return (
        <div className='forecast-row'>
            <p className='forecast-day'>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(date))}</p>
            <ForecastBar dailyForecast={dailyForecast} forecastMinMax={forecastMinMax} />
        </div>
    )
}

/**
 * A ForecastBar component that displays a bar representing the min and max temperatures
 * for a given day.
 * 
 * The bar is anchored to the left by the min temperature in the range [forecast_min, forecast_max]
 * and expands to the right to represent the max temperature in the same range.
 * 
 * The bar is hollow and has a gradient background of #4CAF50 to #45a049.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.dailyForecast - Object containing min and max temperatures for a given day.
 * @param {Object} props.forecastMinMax - Object containing the min and max temperatures for the entire forecast period.
 * 
 * @returns {JSX.Element} The JSX code to display the forecast bar.
 */
function ForecastBar({ dailyForecast, forecastMinMax }) {

    const min = Math.trunc(dailyForecast.min);
    const max = Math.trunc(dailyForecast.max);

    const forecast_min = Math.trunc(forecastMinMax.min);
    const forecast_max = Math.trunc(forecastMinMax.max);

    return (
        // Make round bar shape like apple weather app
        <div className='forecast-bar-container'>

            {/* Display the min temperature to the left of the bar */}
            <div className='forecast-bar-temp'>{min}°</div>

            {/* Add a hollow background bar as large as the forecast_min and forecast_max */}
            <div className='forecast-bar-background'>
                <div className='forecast-bar'
                    style={{
                        // Modify the position of the bar to represent the min and max temperatures in the [forecast_min, forecast_max] range
                        width: `${(max - min) / (forecast_max - forecast_min) * 100}%`,
                        // Anchor the left part of the bar to the min temperature in the forecast_min and forecast_max range
                        left: `${(min - forecast_min) / (forecast_max - forecast_min) * 100}%`,
                        background: `linear-gradient(to right, #4CAF50, #45a049)`
                    }}></div>
            </div>

            {/* Display the max temperature to the right of the bar */}
            <div className='forecast-bar-temp'>{max}°</div>
        </div >
    )
}

const cache = {};

/**
 * Component to display a 5-day forecast.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.query - The query to use to fetch the forecast.
 * @param {Object} props.location - The user's current location as a geolocation object. If null, use the query.
 * @param {string} props.units - The units to use for the forecast.
 * @param {string} props.lang - The language to use for the forecast.
 * 
 * @returns {JSX.Element} The JSX code to display the forecast.
 */
function DailyForecast({ query, location, units, lang }) {

    const [forecastData, setForecastData] = useState(null);

    const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

    useEffect(() => {
        const fetchForecastData = async () => {
            const cacheKey = `${location}_${units}`;
            if (cache[cacheKey]) {
                setForecastData(cache[cacheKey]);
            } else {
                // TODO: Add handling of errors

                const api = !location ?
                    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=${units}&lang=${lang}&appid=${apiKey}` :
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${units}&lang=${lang}&appid=${apiKey}`

                const response = await fetch(api);
                const data = await response.json();

                cache[cacheKey] = data;
                setForecastData(data);
            }
        };

        fetchForecastData();
    },
        // Update if any of the following change.
        [query, location, units, lang, apiKey]);

    return (
        <div className='forecast-card-container'>
            {forecastData ? <ForecastCard forecastData={forecastData} /> : <p>Loading...</p>}
        </div>
    )
}


export default DailyForecast;