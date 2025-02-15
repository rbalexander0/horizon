import { FaLocationArrow } from 'react-icons/fa'
import './CurrentLocation.css';

/**
 * Component to display a button that retrieves the user's current location.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.location - User's current location as a geolocation object.
 * @param {function(location)} props.setLocation - Function to set the user's current location.
 * 
 * @returns {JSX.Element} The JSX code to display the button.
 */
function CurrentLocation({ location, setLocation }) {

    const GetCurrentLocation = async () => {
        navigator.geolocation.getCurrentPosition(setLocation);
    }

    // Assume that user is not moving quickly and only needs to click this buttononce.
    return (location ?
        <button className='current-location-button-active' onClick={GetCurrentLocation}>
            <FaLocationArrow className='current-location-icon' />
        </button > :
        <button className='current-location-button' onClick={GetCurrentLocation}>
            <FaLocationArrow className='current-location-icon' />
            <div className='current-location-text'>Get Current Location</div>
        </button >
    );
}

export default CurrentLocation;