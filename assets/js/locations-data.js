/**
 * Location Data Loading & Processing
 * Handles loading and processing of manual running location data
 */

/**
 * Fetches location data from JSON file
 * @returns {Promise<Object>} Location data object
 */
async function getLocationData() {
  try {
    const response = await fetch('assets/data/running-locations.json');
    if (!response.ok) {
      throw new Error(`Failed to load location data: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Loaded ${data.locations.length} running locations`);
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
}

/**
 * Calculates statistics from location data
 * @param {Object} data - Location data object
 * @returns {Object} Statistics
 */
function calculateLocationStats(data) {
  const stats = {
    totalCities: data.locations.length
  };

  return stats;
}
