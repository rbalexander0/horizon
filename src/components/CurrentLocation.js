import React, { useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa'
import './CurrentLocation.css';

function CurrentLocation({ }) {

    const [currentLocation, setCurrentLocation] = useState(false);

    const GetCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(setCurrentLocation);
    }

    return (currentLocation ?
        <button className='current-location-button-active' onClick={GetCurrentLocation}>
            <FaLocationArrow className='current-location-icon' />
        </button > :
        <button className='current-location-button' onClick={GetCurrentLocation}>
            <FaLocationArrow className='current-location-icon' />
            Get Current Location {currentLocation ? `(${currentLocation.coords.latitude}, ${currentLocation.coords.longitude})` : ''}
        </button >
    );
}

export default CurrentLocation;