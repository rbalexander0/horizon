import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './Map.css';

function Map({ lat, lon }) {
    // TODO: Hide API key from inspect
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const center = {
        lat: lat,
        lng: lon
    }

    return (
        <div className='map-container'>
            <h2>Map</h2>
            <p>Latitude: {lat}</p>
            <p>Longitude: {lon}</p>
            <div className='map'>
                <LoadScript googleMapsApiKey={`${apiKey}`}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={center}
                        zoom={10}
                    // onLoad={onLoad}
                    // onUnmount={onUnmount}
                    >
                        {/* Add markers, overlays, or other map elements here */}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div >
    )
}

export default Map;