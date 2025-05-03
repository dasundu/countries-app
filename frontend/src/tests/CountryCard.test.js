// src/components/__tests__/CountryCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryCard from '../CountryCard';

describe('CountryCard Component', () => {
  // Mock data for testing
  const mockCountry = {
    name: { common: 'Canada' },
    flags: { png: 'https://example.com/canada.png' },
    population: 38000000,
    region: 'Americas',
    capital: ['Ottawa']
  };

  const mockOnClick = jest.fn();
  const mockOnFavoriteToggle = jest.fn();

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the country card with correct information', () => {
    render(
      <CountryCard 
        country={mockCountry} 
        onClick={mockOnClick} 
        isFavorite={false} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    // Check if the country name is displayed
    expect(screen.getByText('Canada')).toBeInTheDocument();
    
    // Check if population is formatted correctly
    expect(screen.getByText(/38,000,000/)).toBeInTheDocument();
    
    // Check if region is displayed
    expect(screen.getByText(/Americas/)).toBeInTheDocument();
    
    // Check if capital is displayed
    expect(screen.getByText(/Ottawa/)).toBeInTheDocument();
    
    // Check if flag image is present with correct alt text
    const flagImg = screen.getByAltText('Flag of Canada');
    expect(flagImg).toBeInTheDocument();
    expect(flagImg).toHaveAttribute('src', 'https://example.com/canada.png');
  });

  it('should display N/A when capital is undefined', () => {
    const countryWithoutCapital = {
      ...mockCountry,
      capital: undefined
    };
    
    render(
      <CountryCard 
        country={countryWithoutCapital} 
        onClick={mockOnClick} 
        isFavorite={false} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    expect(screen.getByText(/Capital:/)).toHaveTextContent('Capital: N/A');
  });

  it('should display filled star when country is favorite', () => {
    render(
      <CountryCard 
        country={mockCountry} 
        onClick={mockOnClick} 
        isFavorite={true} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    // Check if the filled star icon is present
    const favoriteIcon = screen.getByTestId('favorite-icon');
    expect(favoriteIcon).toBeInTheDocument();
    expect(favoriteIcon.querySelector('.filled')).toBeInTheDocument();
  });

  it('should display empty star when country is not favorite', () => {
    render(
      <CountryCard 
        country={mockCountry} 
        onClick={mockOnClick} 
        isFavorite={false} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    // Check if the empty star icon is present
    const favoriteIcon = screen.getByTestId('favorite-icon');
    expect(favoriteIcon).toBeInTheDocument();
    expect(favoriteIcon.querySelector('.filled')).not.toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    render(
      <CountryCard 
        country={mockCountry} 
        onClick={mockOnClick} 
        isFavorite={false} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    // Click on the card
    fireEvent.click(screen.getByRole('region'));
    
    // Check if onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onFavoriteToggle when favorite icon is clicked', () => {
    render(
      <CountryCard 
        country={mockCountry} 
        onClick={mockOnClick} 
        isFavorite={false} 
        onFavoriteToggle={mockOnFavoriteToggle} 
      />
    );
    
    // Click on the favorite icon
    fireEvent.click(screen.getByTestId('favorite-icon'));
    
    // Check if onFavoriteToggle was called and onClick was not
    expect(mockOnFavoriteToggle).toHaveBeenCalledTimes(1);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
