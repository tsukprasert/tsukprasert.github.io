/**
 * Strava Data Fetching & Caching
 * Handles API calls to Strava and local caching
 */

// API Configuration
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const CACHE_KEY = 'strava_activities';
const CACHE_TIMESTAMP_KEY = 'strava_activities_timestamp';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches activities from Strava API
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Array>} Array of activity objects
 */
async function getActivities(forceRefresh = false) {
  // Check if we have cached data and it's still valid
  if (!forceRefresh) {
    const cached = getCachedActivities();
    if (cached) {
      console.log('Using cached activities');
      return cached;
    }
  }

  // Get access token
  const token = getAccessToken();
  if (!token) {
    throw new Error('Not authenticated. Please connect your Strava account.');
  }

  console.log('Fetching activities from Strava API...');

  try {
    // Fetch ALL activities from Strava (paginated)
    let allActivities = [];
    let page = 1;
    let hasMore = true;
    const perPage = 200; // Max allowed by Strava API

    while (hasMore) {
      const response = await fetch(
        `${STRAVA_API_BASE}/athlete/activities?page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          clearToken();
          throw new Error('Authentication expired. Please reconnect your Strava account.');
        }
        throw new Error(`Strava API error: ${response.status}`);
      }

      const activities = await response.json();

      if (activities.length === 0) {
        hasMore = false;
      } else {
        allActivities = allActivities.concat(activities);
        page++;

        // If we got less than perPage, we've reached the end
        if (activities.length < perPage) {
          hasMore = false;
        }
      }
    }

    // Filter for runs only (includes all types of runs, including indoor)
    const runs = allActivities.filter(activity => activity.type === 'Run');

    console.log(`Fetched ${runs.length} runs from Strava (all history)`);

    // Cache the data
    cacheActivities(runs);

    return runs;

  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}

/**
 * Gets cached activities if available and not expired
 * @returns {Array|null} Cached activities or null
 */
function getCachedActivities() {
  const cached = localStorage.getItem(CACHE_KEY);
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

  if (!cached || !timestamp) {
    return null;
  }

  // Check if cache is still valid
  const now = Date.now();
  const cacheAge = now - parseInt(timestamp);

  if (cacheAge > CACHE_TTL) {
    console.log('Cache expired');
    clearCache();
    return null;
  }

  console.log(`Cache age: ${Math.round(cacheAge / 1000 / 60)} minutes`);
  return JSON.parse(cached);
}

/**
 * Caches activities to localStorage
 * @param {Array} activities - Activities to cache
 */
function cacheActivities(activities) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(activities));
  localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
}

/**
 * Clears cached activities
 */
function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

/**
 * Gets cache timestamp
 * @returns {Date|null} Cache timestamp or null
 */
function getCacheTimestamp() {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return null;
  return new Date(parseInt(timestamp));
}

/**
 * Calculates pace in min/mile from moving time and distance
 * @param {number} movingTimeSeconds - Moving time in seconds
 * @param {number} distanceMeters - Distance in meters
 * @returns {string} Formatted pace (e.g., "8:30/mi")
 */
function calculatePace(movingTimeSeconds, distanceMeters) {
  const minutes = movingTimeSeconds / 60;
  const miles = distanceMeters / 1609.34;

  if (miles === 0) return 'N/A';

  const paceMinPerMile = minutes / miles;
  const paceMin = Math.floor(paceMinPerMile);
  const paceSec = Math.round((paceMinPerMile - paceMin) * 60);

  return `${paceMin}:${paceSec.toString().padStart(2, '0')}/mi`;
}

/**
 * Converts meters to miles
 * @param {number} meters - Distance in meters
 * @returns {number} Distance in miles
 */
function metersToMiles(meters) {
  return meters / 1609.34;
}

/**
 * Converts meters to feet
 * @param {number} meters - Elevation in meters
 * @returns {number} Elevation in feet
 */
function metersToFeet(meters) {
  return meters * 3.28084;
}

/**
 * Formats seconds into hours and minutes
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g., "2h 30m")
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Formats date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculates aggregate stats from activities
 * @param {Array} activities - Array of activity objects
 * @returns {Object} Aggregate statistics
 */
function calculateStats(activities) {
  const stats = {
    totalActivities: activities.length,
    totalDistance: 0,
    totalElevation: 0,
    differentPlaces: 0
  };

  // Calculate totals
  activities.forEach(activity => {
    stats.totalDistance += activity.distance || 0;
    stats.totalElevation += activity.total_elevation_gain || 0;
  });

  // Calculate number of different places (unique start locations within ~1km)
  const uniqueLocations = new Set();
  activities.forEach(activity => {
    if (activity.start_latlng && activity.start_latlng.length === 2) {
      // Round to 2 decimal places (~1.1km precision)
      const lat = Math.round(activity.start_latlng[0] * 100) / 100;
      const lng = Math.round(activity.start_latlng[1] * 100) / 100;
      uniqueLocations.add(`${lat},${lng}`);
    }
  });
  stats.differentPlaces = uniqueLocations.size;

  return stats;
}
