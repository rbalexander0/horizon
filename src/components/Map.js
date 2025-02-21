import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './Map.css';

function Map({ data }) {

    if (!data) {
        return null;
    }

    // TODO: Hide API key from inspect
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const center = {
        lat: data?.coord?.lat,
        lng: data?.coord?.lon
    }
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '8px',
    }

    return (
        <div className='map-container'>
            <LoadScript googleMapsApiKey={`${apiKey}`}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={11}
                >
                    {/* Overlay current location */}
                </GoogleMap>
            </LoadScript>
        </div >
    )
}

export default Map;