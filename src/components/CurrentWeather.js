import './CurrentWeather.css';
import { useEffect, useState } from 'react';

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Component to display current weather information in a card.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing temperature and other weather details.
 * @param {string} props.summary - Summary of the current weather condition.
 * @returns {JSX.Element} The JSX code to display current weather information.
 */
function TemperatureCard({ data, summary }) {
    return (
        <div className='temperature-card'>
            <div className='temperature-current'>{Math.trunc(data.main.temp)}°</div>
            {/* <p>Feels Like: {Math.trunc(data.main.feels_like)}°</p> */}
            <p className='condition'>{summary}</p>
            <div className='temperature-high-low'>H:{Math.trunc(data.main.temp_max)}° L:{Math.trunc(data.main.temp_min)}°</div>

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
    // Adjustment factor to display correct in local timezone.
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;

    const sunriseDate = new Date((data.sys.sunrise + data.timezone) * 1000 + timezoneOffset);
    const sunsetDate = new Date((data.sys.sunset + data.timezone) * 1000 + timezoneOffset);

    return (
        <div className='weather-card'>
            <p>sunrise: {sunriseDate.toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
            <p>sunset: {sunsetDate.toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}</p>
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
            <p>wind speed: {Math.trunc(data.wind.speed)} MPH</p>
            <p>wind direction: {getWindDirection(data.wind.deg)}</p>
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
            <p className='description'>humidity: {data.main.humidity}%</p>
            <p className='description'>pressure: {data.main.pressure} mBar</p>
            <p className='description'>visibility: {data.visibility > 1000 ? `${Math.trunc(data.visibility / 1000)} km` : `${Math.trunc(data.visibility)} m`}</p>
        </div>
    )
}

// Cache summaries
const summary_cache = {};

// Displays current info
/**
 * Component to display current weather information.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data object containing temperature and other weather details.
 * @returns {JSX.Element} The JSX code to display current weather information.
 */
function CurrentWeather({ data }) {

    const [summary, setSummary] = useState('test');

    useEffect(() => {
        const summarize = async (data) => {

            // Cache summaries per city name -- it's not needed to make a request when e.g. units change
            if (summary_cache[data.name]) {
                setSummary(summary_cache[data.name]);
                return;
            }

            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are a meteorologist, your task is to summarize this weather data in three to five words (use fewer words if you think the information is irrelevant) without mentioning the city name or using numbers. do not end with a period. precede the text with the best emoji relevant and one space. example: "cloudy with high winds", example: "sunny and calm", example: "heavy snow". data: ${JSON.stringify(data)}`;
            const result = await model.generateContent(prompt);

            summary_cache[data.name] = result.response.text();
            setSummary(summary_cache[data.name]);
        };

        summarize(data);

    }, [data]);

    return (
        <div>{data ?
            (
                <div className='weather-container'>
                    {/* TODO: Clean this up and make it look nicer */}
                    <TemperatureCard data={data} summary={summary} />
                    {/* <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt={data.weather[0].description} /> */}
                    <div className='weather-card-container'>
                        <SunriseSunsetCard data={data} />
                        <WindCard data={data} />
                        <OtherInfoCard data={data} />
                    </div>
                </div>
            ) : (
                <div className='loading-container'>
                    <div className='loading-circle'></div>
                    <div className='loading-text'>loading weather data...</div>
                </div>
            )}</div>);
}

export default CurrentWeather;