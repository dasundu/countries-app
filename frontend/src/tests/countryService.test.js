// src/services/__tests__/countryService.test.js
import axios from 'axios';
import { 
  getAllCountries, 
  getCountryByName, 
  getCountryByCode, 
  getCountriesByRegion, 
  getCountriesByCodes 
} from '../countryService';

// Mock axios
jest.mock('axios');

describe('Country Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCountries', () => {
    it('should fetch and sort all countries', async () => {
      // Mock data
      const mockCountries = [
        { name: { common: 'Zimbabwe' } },
        { name: { common: 'Albania' } }
      ];
      
      // Mock the axios response
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      // Call the function
      const result = await getAllCountries();
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
      expect(result).toEqual([
        { name: { common: 'Albania' } },
        { name: { common: 'Zimbabwe' } }
      ]);
    });

    it('should handle errors when fetching all countries', async () => {
      // Mock axios to throw an error
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      // Call the function and expect it to throw
      await expect(getAllCountries()).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    });
  });

  describe('getCountryByName', () => {
    it('should fetch country by name', async () => {
      const mockCountry = [{ name: { common: 'Canada' } }];
      axios.get.mockResolvedValueOnce({ data: mockCountry });
      
      const result = await getCountryByName('Canada');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Canada');
      expect(result).toEqual(mockCountry);
    });

    it('should handle errors when fetching country by name', async () => {
      const errorMessage = 'Country not found';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(getCountryByName('NonExistentCountry')).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/NonExistentCountry');
    });
  });

  // Add similar tests for getCountryByCode, getCountriesByRegion, and getCountriesByCodes
  describe('getCountriesByCodes', () => {
    it('should return empty array if no codes provided', async () => {
      const result = await getCountriesByCodes([]);
      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should fetch countries by multiple codes', async () => {
      const mockCountries = [
        { name: { common: 'Canada' } },
        { name: { common: 'Mexico' } }
      ];
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await getCountriesByCodes(['CA', 'MX']);
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha?codes=CA,MX');
      expect(result).toEqual(mockCountries);
    });
  });
});
