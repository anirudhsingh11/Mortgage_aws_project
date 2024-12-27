const cognitoDomain = "ap-south-17dbzd8qbd.auth.ap-south-1.amazoncognito.com"; 
const clientId = "4r3fhmqmqdspv1uq975m2qm270"; 
const redirectUri = "http://localhost:8000/callback.html";

function getLoginUrl() {
  const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return loginUrl;
}

function loginWithCognito() {
  const loginUrl = getLoginUrl();
  console.log('Redirecting to:', loginUrl);
  window.location.href = loginUrl;
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

window.loginWithCognito = loginWithCognito;
window.logout = logout;

  