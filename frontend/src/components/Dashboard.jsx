import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountryCard from './CountryCard';
import CountryDetails from './CountryDetails';
import '../style/Dashboard.css';
import { FaStar, FaMoon, FaSun } from 'react-icons/fa';
import { 
  getAllCountries, 
  getCountriesByRegion, 
  
} from '../service/countryService';

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

  // Fetch countries data using the first API endpoint
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
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

  // Filter countries based on search term and region
  useEffect(() => {
    let result = countries;

    // Apply favorites filter
    if (showFavorites) {
      result = result.filter(country => 
        favorites.includes(country.cca3)
      );
    }

    setFilteredCountries(result);
  }, [countries, showFavorites, favorites]);

  // Handle region filter change using API endpoint
  const handleRegionChange = async (region) => {
    setRegionFilter(region);
    
    if (region) {
      try {
        setLoading(true);
        const data = await getCountriesByRegion(region);
        
        // If showing favorites, filter the region results for favorites only
        if (showFavorites) {
          setFilteredCountries(data.filter(country => favorites.includes(country.cca3)));
        } else {
          setFilteredCountries(data);
        }
      } catch (err) {
        setError(`Failed to fetch countries for region ${region}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      // If no region selected, revert to all countries (or favorites if filtered)
      if (showFavorites) {
        setFilteredCountries(countries.filter(country => favorites.includes(country.cca3)));
      } else {
        setFilteredCountries(countries);
      }
    }
  };

  // Update search term and filter countries directly
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Filter countries based on search term
    filterCountries(term);
  };
  
  // Function to filter countries based on search term
  const filterCountries = (term) => {
    // If search term is empty, revert to current filter state
    if (!term.trim()) {
      if (regionFilter) {
        // Just apply region filter without API call
        const regionFiltered = countries.filter(country => 
          country.region === regionFilter
        );
        
        setFilteredCountries(showFavorites 
          ? regionFiltered.filter(country => favorites.includes(country.cca3)) 
          : regionFiltered
        );
      } else {
        setFilteredCountries(showFavorites 
          ? countries.filter(country => favorites.includes(country.cca3)) 
          : countries
        );
      }
      return;
    }
    
    // Filter locally first for immediate feedback
    let result = countries.filter(country => 
      country.name.common.toLowerCase().includes(term.toLowerCase()) ||
      (country.capital && country.capital.some(cap => 
        cap.toLowerCase().includes(term.toLowerCase())
      ))
    );
    
    // Apply additional filters
    if (regionFilter) {
      result = result.filter(country => country.region === regionFilter);
    }
    
    if (showFavorites) {
      result = result.filter(country => favorites.includes(country.cca3));
    }
    
    setFilteredCountries(result);
  };

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
  
  const toggleFavoritesFilter = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    
    // Apply filter based on new state
    if (newShowFavorites) {
      setFilteredCountries(
        regionFilter 
        ? filteredCountries.filter(country => favorites.includes(country.cca3))
        : countries.filter(country => favorites.includes(country.cca3))
      );
    } else if (regionFilter) {
      // If region filter is active, re-apply just that filter
      handleRegionChange(regionFilter);
    } else {
      // If no region filter, show all countries
      setFilteredCountries(countries);
    }
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
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              
            </div>
            <div className="filter-controls">
              <div className="region-filter">
                <select 
                  value={regionFilter} 
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="region-select"
                  aria-label="Filter by region"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (   
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <button 
                className={`favorite-filter-btn ${showFavorites ? 'active' : ''}`}
                onClick={toggleFavoritesFilter}
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