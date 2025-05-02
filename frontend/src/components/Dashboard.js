import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountryCard from './CountryCard';
import CountryDetails from './CountryDetails';
import './Dashboard.css';
import { FaStar, FaMoon, FaSun } from 'react-icons/fa';

const Dashboard = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Set dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [user?.id]);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://restcountries.com/v3.1/all');
        // Sort countries alphabetically by name
        const sortedCountries = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
      } catch (err) {
        setError('Failed to fetch countries data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (user?.id && favorites.length > 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user?.id]);

  useEffect(() => {
    let result = countries;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.capital && country.capital.some(cap => 
          cap.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Apply region filter
    if (regionFilter) {
      result = result.filter(country => 
        country.region === regionFilter
      );
    }

    // Apply favorites filter
    if (showFavorites) {
      result = result.filter(country => 
        favorites.includes(country.cca3)
      );
    }

    setFilteredCountries(result);
  }, [searchTerm, regionFilter, countries, showFavorites, favorites]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    // Scroll to top when viewing country details
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedCountry(null);
  };
  
  const toggleFavorite = (countryCode, event) => {
    // Stop propagation to prevent triggering the card click
    event.stopPropagation();
    
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(countryCode)) {
        return prevFavorites.filter(code => code !== countryCode);
      } else {
        return [...prevFavorites, countryCode];
      }
    });
  };
  
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  if (loading) return (
    <div className="loading">
      <div className="loader"></div>
      <p>Loading countries...</p>
    </div>
  );
  
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Countries Explorer</h1>
        <div className="controls">
          <div className="user-info">
          <button onClick={toggleDarkMode} className="mode-toggle-icon" aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <span>Welcome, {user?.name || 'User'}</span>
            
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {selectedCountry ? (
        <CountryDetails 
          country={selectedCountry} 
          onBackClick={handleBackClick}
          darkMode={darkMode} 
        />
      ) : (
        <>
          <div className="filters">
            <div className="search-container">
              
              <input
                type="text"
                placeholder="Search for a country or capital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <div className="region-filter">
                <select 
                  value={regionFilter} 
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="region-select"
                  aria-label="Filter by region"
                >
                  <option value="">Filter by Region</option>
                  {regions.map(region => (   
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <button 
                className={`favorite-filter-btn ${showFavorites ? 'active' : ''}`}
                onClick={() => setShowFavorites(!showFavorites)}
                aria-label={showFavorites ? 'Show all countries' : 'Show favorite countries'}
              >
                <FaStar className="star-icon" />
                {showFavorites ? 'Show All' : 'Show Favorites'}
              </button>
            </div>
          </div>

          <div className="countries-grid">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(country => (
                <CountryCard 
                  key={country.cca3} 
                  country={country} 
                  onClick={() => handleCountryClick(country)}
                  isFavorite={favorites.includes(country.cca3)}
                  onFavoriteToggle={(e) => toggleFavorite(country.cca3, e)}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No countries found matching your criteria</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;