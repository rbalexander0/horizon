import "./UnitsButton.css";

function UnitsButton({ onClick, units }) {
    return (
        <button className="units-button" onClick={onClick}>
            {units === "metric" ? "°C" : "°F"}
        </button>
    );
}

export default UnitsButton;