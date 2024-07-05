// src/csvReader.js
import { dsvFormat } from 'd3-dsv';
import { text } from 'd3-fetch';

export const readCSV = (filePath, callback, delimiter = ',') => {
  console.log(`Attempting to fetch CSV from: ${filePath}`);
  text(filePath)
    .then((data) => {
      console.log(`Fetched data: ${data}`); // Log the first 100 characters
      const parser = dsvFormat(delimiter);
      const parsedData = parser.parse(data);
      console.log('Parsed CSV data:', parsedData);
      callback(parsedData);
    })
    .catch((error) => {
      console.error('Error fetching or parsing CSV:', error);
    });
};
