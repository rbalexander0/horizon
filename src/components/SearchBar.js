import './SearchBar.css';
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react';
import React from 'react';

function SearchBar({ setQuery, showSearchBox, setShowSearchBox }) {

    const [searchText, setSearchText] = useState('');

    const searchBarRef = React.createRef();

    const toggleSearchBox = () => {
        setShowSearchBox(!showSearchBox);
    }
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    }

    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-bar"
                style={{
                    width: showSearchBox ? '120px' : '0px', // Set the width to max-content when the search box is shown' : '0px',
                    paddingLeft: showSearchBox ? '6px' : '0px',
                    paddingRight: showSearchBox ? '6px' : '0px'
                }}
                value={searchText}
                ref={searchBarRef}
                onChange={handleSearchTextChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                        if (showSearchBox) {
                            console.log(searchText);
                            if (searchText) setQuery(searchText);
                        }
                        toggleSearchBox();
                    }
                }}
            />
            <button
                className='search-button'
                onClick={() => {
                    if (showSearchBox) {
                        console.log(searchText);
                        if (searchText) setQuery(searchText);
                    }
                    toggleSearchBox();
                }}
            >
                <FaSearch className='search-icon' />
            </button>
        </div>
    );

}

export default SearchBar;
