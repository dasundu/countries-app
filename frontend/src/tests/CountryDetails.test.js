// src/components/__tests__/CountryDetails.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryDetails from '../CountryDetails';
import * as countryService from '../service/countryService';

// Mock the countryService
jest.mock('../service/countryService');

describe('CountryDetails Component', () => {
  const mockCountry = {
    cca3: 'CAN',
    name: { common: 'Canada', official: 'Canada' },
    flags: { png: 'https://example.com/canada.png' },
    population: 38000000,
    region: 'Americas',
    subregion: 'North America',
    capital: ['Ottawa'],
    tld: ['.ca'],
    currencies: { CAD: { name: 'Canadian dollar' } },
    languages: { eng: 'English', fra: 'French' },
    area: 9984670,
    borders: ['USA']
  };

  const mockBorderCountries = [
    { cca3: 'USA', name: { common: 'United States' } }
  ];

  const mockOnBackClick = jest.fn();

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify({ id: '123' });
      if (key === 'favorites_123') return JSON.stringify(['USA']);
      return null;
    });
    
    Storage.prototype.setItem = jest.fn();
    
    // Mock the service function
    countryService.getCountriesByCodes.mockResolvedValue(mockBorderCountries);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render country details correctly', async () => {
    render(
      <CountryDetails 
        country={mockCountry} 
        onBackClick={mockOnBackClick} 
        darkMode={false} 
      />
    );
    
    // Check if basic information is displayed
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText(/38,000,000/)).toBeInTheDocument();
    expect(screen.getByText(/Americas/)).toBeInTheDocument();
    expect(screen.getByText(/North America/)).toBeInTheDocument();
    expect(screen.getByText(/Ottawa/)).toBeInTheDocument();
    expect(screen.getByText(/\.ca/)).toBeInTheDocument();
    expect(screen.getByText(/Canadian dollar/)).toBeInTheDocument();
    expect(screen.getByText(/English, French/)).toBeInTheDocument();
    expect(screen.getByText(/9,984,670 km²/)).toBeInTheDocument();
    
    // Check if border countries are fetched and displayed
    expect(countryService.getCountriesByCodes).toHaveBeenCalledWith(['USA']);
    
    // Wait for border countries to load
    const borderCountry = await screen.findByText('United States');
    expect(borderCountry).toBeInTheDocument();
  });

  it('should toggle favorite status when star is clicked', () => {
    render(
      <CountryDetails 
        country={mockCountry} 
        onBackClick={mockOnBackClick} 
        darkMode={false} 
      />
    );
    
    // Click the favorite button
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    
    // Check if localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'favorites_123',
      JSON.stringify(['USA', 'CAN'])
    );
  });

  it('should call onBackClick when back button is clicked', () => {
    render(
      <CountryDetails 
        country={mockCountry} 
        onBackClick={mockOnBackClick} 
        darkMode={false} 
      />
    );
    
    // Click the back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    
    // Check if onBackClick was called
    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });
});
