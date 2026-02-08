/**
 * Hybrid Map Rendering with Leaflet
 * Combines Strava stats with manual city marker visualization
 */

let map = null;
let markers = [];
let locationData = null; // Store location data globally for dropdown

/**
 * Initializes the page
 */
async function initializePage() {
  // Load location data and display map
  await loadAndDisplayData();
}

/**
 * Loads location data and displays map
 */
async function loadAndDisplayData() {
  showLoading(true);
  showError(null);

  try {
    // Load location data for the map
    locationData = await getLocationData();

    // Initialize map with world view
    initializeMap();

    // Render city markers
    renderCityMarkers(locationData.locations);

    // Populate location dropdown
    populateLocationDropdown(locationData.locations);

    // Update stats panel with data from JSON
    updateStatsPanel(locationData);

    // Show location selector
    showLocationSelector(true);

    // Update last updated timestamp
    updateLastUpdatedTime(locationData.lastUpdated);

  } catch (error) {
    console.error('Error loading data:', error);
    showError(error.message || 'Failed to load running data. Please try again.');
  } finally {
    showLoading(false);
  }
}

/**
 * Initializes the Leaflet map with world view
 */
function initializeMap() {
  if (map) {
    map.remove(); // Remove existing map if any
  }

  // World view - centered to show multiple continents
  map = L.map('running-map').setView([20, 0], 2);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2
  }).addTo(map);

  // Show the map container
  document.getElementById('running-map').style.display = 'block';
}

/**
 * Renders city markers on the map
 * @param {Array} locations - Array of location objects
 */
function renderCityMarkers(locations) {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const bounds = [];

  locations.forEach(location => {
    const { lat, lng } = location.coordinates;

    // Create custom icon with city label
    const icon = L.divIcon({
      className: 'city-marker',
      html: `<div class="marker-pin"></div><div class="marker-label">${location.city}</div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42]
    });

    // Create marker
    const marker = L.marker([lat, lng], { icon: icon });

    // Create popup content
    const popupContent = createCityPopup(location);
    marker.bindPopup(popupContent, {
      maxWidth: 350,
      className: 'city-popup-container'
    });

    // Add to map
    marker.addTo(map);
    markers.push(marker);

    // Add to bounds for fitting
    bounds.push([lat, lng]);
  });

  // Fit map to show all markers (with padding)
  if (bounds.length > 0) {
    const latLngBounds = L.latLngBounds(bounds);
    map.fitBounds(latLngBounds, {
      padding: [50, 50],
      maxZoom: 4  // Don't zoom in too much for world view
    });
  }
}

/**
 * Creates popup HTML for a city marker
 * @param {Object} location - Location object
 * @returns {string} HTML content for popup
 */
function createCityPopup(location) {
  const locationLabel = location.state
    ? `${location.city}, ${location.state}, ${location.country}`
    : `${location.city}, ${location.country}`;

  let notesHtml = '';
  if (location.Notes && location.Notes.length > 0) {
    notesHtml = '<div class="notes-section">';
    notesHtml += '<h5 style="margin-top: 0.5rem; margin-bottom: 0.8rem; color: #014e85; font-size: 1rem;">Notes:</h5>';

    location.Notes.forEach(note => {
      notesHtml += `
        <div class="note-item" style="margin-bottom: 0.8rem; padding-left: 1rem; border-left: 3px solid #FAB95B;">
          <strong style="color: #014e85; font-size: 0.95rem;">${note.title}</strong>
          ${note.date ? `<br><small style="color: #666;">${formatDate(note.date)}</small>` : ''}
          ${note.distance ? ` • <small style="color: #666;">${note.distance} mi</small>` : ''}
          ${note.description ? `<br><p style="margin-top: 0.3rem; margin-bottom: 0; font-size: 0.9rem; line-height: 1.5;">${note.description}</p>` : ''}
        </div>
      `;
    });

    notesHtml += '</div>';
  }

  return `
    <div class="city-popup">
      <h4 style="color: #014e85; margin-bottom: 0.8rem; margin-top: 0; font-size: 1.2rem;">${locationLabel}</h4>
      ${notesHtml}
    </div>
  `;
}

/**
 * Updates the stats panel with data from JSON
 * @param {Object} locationData - Location data object
 */
function updateStatsPanel(locationData) {
  // Calculate location stats
  const locationStats = calculateLocationStats(locationData);

  // Update location stats
  document.getElementById('total-cities').textContent = locationStats.totalCities;

  // Update Strava stats from JSON (if available)
  if (locationData.stravaStats) {
    document.getElementById('total-activities').textContent = locationData.stravaStats.totalRuns;
    document.getElementById('total-distance').textContent = locationData.stravaStats.totalDistance.toFixed(1) + ' mi';
  } else {
    // Show placeholders if not available
    document.getElementById('total-activities').textContent = '-';
    document.getElementById('total-distance').textContent = '-';
  }

  // Show stats panel
  document.getElementById('stats-panel').style.display = 'block';
}

/**
 * Updates the last updated timestamp
 * @param {string} dateString - Last updated date from location data
 */
function updateLastUpdatedTime(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const timeString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    document.getElementById('last-updated').textContent = timeString;
  }
}

/**
 * Populates the location dropdown with cities
 * @param {Array} locations - Array of location objects
 */
function populateLocationDropdown(locations) {
  const select = document.getElementById('city-select');
  if (!select) return;

  // Clear existing options (except the first placeholder)
  select.innerHTML = '<option value="">Select a city...</option>';

  // Create array with original indices and sort alphabetically by city name
  const sortedLocations = locations
    .map((location, index) => ({ location, index }))
    .sort((a, b) => a.location.city.localeCompare(b.location.city));

  // Add option for each location in sorted order
  sortedLocations.forEach(({ location, index }) => {
    const option = document.createElement('option');
    option.value = index; // Use original index for jumpToCity()
    const label = location.state
      ? `${location.city}, ${location.state}`
      : `${location.city}, ${location.country}`;
    option.textContent = label;
    select.appendChild(option);
  });
}

/**
 * Jumps to a specific city on the map
 * @param {string} index - Index of the location in the array
 */
function jumpToCity(index) {
  if (index === '' || !locationData) return;

  const location = locationData.locations[parseInt(index)];
  if (!location) return;

  const { lat, lng } = location.coordinates;

  // Zoom to the city
  map.setView([lat, lng], 12, {
    animate: true,
    duration: 1
  });

  // Open the marker popup
  if (markers[parseInt(index)]) {
    markers[parseInt(index)].openPopup();
  }
}

// ===== UI Helper Functions =====

/**
 * Shows or hides the authentication prompt
 * @param {boolean} show - Whether to show the prompt
 */
function showAuthPrompt(show = true) {
  const prompt = document.getElementById('auth-prompt');
  if (prompt) {
    prompt.style.display = show ? 'block' : 'none';
  }
}

/**
 * Shows or hides the loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = show ? 'block' : 'none';
  }
}

/**
 * Shows or hides location selector dropdown
 * @param {boolean} show - Whether to show selector
 */
function showLocationSelector(show) {
  const selector = document.getElementById('location-selector');
  if (selector) {
    selector.style.display = show ? 'block' : 'none';
  }
}

/**
 * Displays an error message
 * @param {string|null} message - Error message to display (null to hide)
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');

  if (!errorDiv || !errorText) return;

  if (message) {
    errorText.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    errorDiv.style.display = 'none';
  }
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
