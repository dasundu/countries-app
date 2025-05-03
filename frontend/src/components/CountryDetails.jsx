import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar, FaArrowLeft, FaGlobe } from 'react-icons/fa';
import '../style/CountryDetails.css';
import { getCountriesByCodes } from '../service/countryService';

const CountryDetails = ({ country, onBackClick, darkMode }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Check if country is in favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.includes(country.cca3));
    }
  }, [country.cca3, user?.id]);

  // Fetch border countries using the API endpoint for multiple codes
  useEffect(() => {
    const fetchBorderCountries = async () => {
      // If country has borders, fetch their data
      if (country.borders && country.borders.length > 0) {
        setLoading(true);
        try {
          // Use the service to fetch border countries by their codes
          const data = await getCountriesByCodes(country.borders);
          setBorderCountries(data);
        } catch (err) {
          console.error('Error fetching border countries:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBorderCountries();
  }, [country]);

  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  const getLanguages = (languages) => {
    return languages ? Object.values(languages).join(', ') : 'N/A';
  };

  const getCurrencies = (currencies) => {
    return currencies ? Object.values(currencies).map(currency => currency.name).join(', ') : 'N/A';
  };

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.id}`) || '[]';
    const favorites = JSON.parse(savedFavorites);
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(code => code !== country.cca3);
    } else {
      updatedFavorites = [...favorites, country.cca3];
    }
    
    localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Function to handle clicking on a border country
  const handleBorderCountryClick = (borderCountry) => {
    // If we had routing for individual countries, we could navigate to the border country page
    // For now, we'll log it
    console.log('Navigate to border country:', borderCountry.name.common);
    // Ideally, this would be implemented with a function passed from the parent to navigate
  };

  return (
    <div className="country-details">
      <div className="details-header">
        <button onClick={onBackClick} className="back-button">
          <FaArrowLeft />
          Back
        </button>
        <button onClick={toggleFavorite} className="favorite-button">
          {isFavorite ? <FaStar className="star-icon filled" /> : <FaRegStar className="star-icon" />}
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
      
      <div className="country-details-content">
        <div className="country-flag-large">
          <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} />
        </div>
        
        <div className="country-details-info">
          <h2>{country.name.common}</h2>
          <div className="details-grid">
            <div className="details-column">
              <p><strong>Official Name:</strong> {country.name.official}</p>
              <p><strong>Population:</strong> {formatPopulation(country.population)}</p>
              <p><strong>Region:</strong> {country.region}</p>
              <p><strong>Sub Region:</strong> {country.subregion || 'N/A'}</p>
              <p><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
            </div>
            
            <div className="details-column">
              <p><strong>Top Level Domain:</strong> {country.tld ? country.tld.join(', ') : 'N/A'}</p>
              <p><strong>Currencies:</strong> {getCurrencies(country.currencies)}</p>
              <p><strong>Languages:</strong> {getLanguages(country.languages)}</p>
              {country.area && <p><strong>Area:</strong> {formatPopulation(country.area)} km²</p>}
            </div>
          </div>
          
          <div className="border-countries">
            <h3>Border Countries:</h3>
            {loading ? (
              <p className="loading-borders">Loading border countries...</p>
            ) : borderCountries.length > 0 ? (
              <div className="border-buttons">
                {borderCountries.map(border => (
                  <span 
                    key={border.cca3} 
                    className="border-country"
                    onClick={() => handleBorderCountryClick(border)}
                  >
                    {border.name.common}
                  </span>
                ))}
              </div>
            ) : (
              <p>No bordering countries</p>
            )}
          </div>

          {country.maps && (
            <div className="country-map-links">
              {country.maps.googleMaps && (
                <a 
                  href={country.maps.googleMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  <FaGlobe /> View on Google Maps
                </a>
              )}
              {country.maps.openStreetMaps && (
                <a 
                  href={country.maps.openStreetMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  <FaGlobe /> View on OpenStreetMap
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;