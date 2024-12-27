const appDiv = document.getElementById('app');

const routes = {
  '/': 'src/pages/home.html',
  '/callback': 'src/pages/callback.html',
  '/calculation': 'src/pages/calculations.html',
  '/404': '<h1>Page Not Found</h1>'
};

async function navigateTo(url) {
  // Extract the path without the hash
  const path = url.split('#')[0] || '/';
  console.log('Navigating to:', path, 'Full URL:', url);
  
  // Remove any trailing slashes for consistency
  const normalizedPath = path.replace(/\/$/, '') || '/';
  console.log('Normalized path:', normalizedPath);
  
  const route = routes[normalizedPath] || routes['/404'];
  let content;
  
  if (route.startsWith('<')) {
    content = route;
  } else {
    try {
      console.log('Fetching:', route);
      const response = await fetch(route);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      content = await response.text();
    } catch (error) {
      console.error('Navigation error:', error);
      content = '<h1>Error loading page</h1>';
    }
  }
  
  appDiv.innerHTML = content;

  // Important: Call handleAuthCallback after the content is loaded
  if (normalizedPath === '/callback') {
    console.log('Attempting to call handleAuthCallback');
    // Give the DOM time to update before calling handleAuthCallback
    setTimeout(() => {
      if (typeof handleAuthCallback === 'function') {
        console.log('Calling handleAuthCallback');
        handleAuthCallback();
      } else {
        console.error('handleAuthCallback is not defined');
      }
    }, 100);
  }
  
  if (normalizedPath === '/calculation') {
    loadCalculationLogic();
  }
}

// Link Interception for SPA Routing
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    const url = e.target.href;
    window.history.pushState({}, '', url);
    navigateTo(url);
  }
});

// Handle Back/Forward
window.onpopstate = () => {
  const fullUrl = window.location.pathname + window.location.hash;
  console.log('Handling popstate for:', fullUrl);
  navigateTo(fullUrl);
};

// Initial Page Load
window.addEventListener('DOMContentLoaded', () => {
  const fullUrl = window.location.pathname + window.location.hash;
  console.log('Initial load for:', fullUrl);
  navigateTo(fullUrl);
});

// Add this to help with debugging
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
});
