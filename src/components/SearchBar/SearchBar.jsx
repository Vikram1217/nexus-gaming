import './SearchBar.css';
import { useRef, useEffect } from 'react';



function SearchBar({ value, onChange }) {
  const searchRef = useRef(null);
  useEffect(() => {
    searchRef.current.focus()
  }, [])
  return (
    <div className='search-container'>
      <div className="search-wrapper">
        <input
          className='search-input'
          type='text'
          placeholder='Search millions of games...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={searchRef}
        />
        
        {/* Challenge: Clear button only shows if there is text */}
        {value.length > 0 && (
          <button 
            className="clear-btn" 
            onClick={() => onChange("")}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;