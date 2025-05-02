import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './CountryCard.css';

const CountryCard = ({ country, onClick, isFavorite, onFavoriteToggle }) => {
  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  // Handle case when capital is undefined
  const capital = country.capital && country.capital.length > 0 
    ? country.capital[0] 
    : 'N/A';

  return (
    <div className="country-card" onClick={onClick}>
      <div 
        className="favorite-icon" 
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(e);
        }}
      >
        {isFavorite ? 
          <FaStar className="star filled" /> : 
          <FaRegStar className="star" />
        }
      </div>
      <div className="flag-container">
        <img 
          src={country.flags.png} 
          alt={`Flag of ${country.name.common}`} 
          className="country-flag"
          loading="lazy"
        />
      </div>
      <div className="country-info">
        <h3 className="country-name">{country.name.common}</h3>
        <p><strong>Population:</strong> {formatPopulation(country.population)}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Capital:</strong> {capital}</p>
      </div>
    </div>
  );
};

export default CountryCard;