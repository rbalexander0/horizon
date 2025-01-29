import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import './Map.css';

function Map({ lat, lon }) {

    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        const fetchApiKey = async () => {
            const response = await fetch('http://localhost:5000/api/google-maps-api-key');
            const data = await response.json();

            // TODO: Hide API key from inspect
            setApiKey(data.key);
        };

        fetchApiKey();

    }, []);

    const center = {
        lat: lat,
        lng: lon
    }
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '8px',
    }

    return (
        <>
            {lat && lon ? (
                <div className='map-container'>
                    <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={11}
                        >
                            {/* Overlay current location */}
                        </GoogleMap>
                    </LoadScript>
                </div >
            ) : (
                <div className='loading-container'>
                    <div className='loading-circle'></div>
                    <div className='loading-text'>loading map...</div>
                </div>
            )}

        </>
    )
}

export default Map;