// src/services/countryService.js
import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// 1. Get all countries (ENDPOINT #1)
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    // Sort countries alphabetically by name
    return response.data.sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// 2. Get country by name (ENDPOINT #2)
export const getCountryByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country by name ${name}:`, error);
    throw error;
  }
};

// 3. Get country by code (ENDPOINT #3)
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data[0]; // Returns a single country object
  } catch (error) {
    console.error(`Error fetching country by code ${code}:`, error);
    throw error;
  }
};

// 4. Get countries by region (ENDPOINT #4)
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data.sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error(`Error fetching countries by region ${region}:`, error);
    throw error;
  }
};

// 5. Get multiple countries by code (uses the same alpha endpoint but with multiple codes)
export const getCountriesByCodes = async (codes) => {
  if (!codes || codes.length === 0) return [];
  try {
    const codeString = codes.join(',');
    const response = await axios.get(`${BASE_URL}/alpha?codes=${codeString}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by codes ${codes}:`, error);
    throw error;
  }
};