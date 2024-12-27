const cognitoDomain = "ap-south-17dbzd8qbd.auth.ap-south-1.amazoncognito.com"; 
const clientId = "4r3fhmqmqdspv1uq975m2qm270"; 
const redirectUri = "http://localhost:8000/callback"; 
//const redirectUri = "https://google.com"; 

const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");

// Function to build the login URL
function getLoginUrl() {
  const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return loginUrl;
}

function loginWithCognito() {
  window.location.href = getLoginUrl();
}

// Function to check if the user is logged in
function checkLogin() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");

  if (accessToken) {
    document.querySelector(".auth-container h1").innerText = "You are logged in!";
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  }
}

// Redirect to Cognito Hosted UI for login
loginButton.addEventListener("click", () => {
  window.location.href = getLoginUrl();
});

// Logout (clears tokens and redirects to the Hosted UI logout page)
logoutButton.addEventListener("click", () => {
  const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = logoutUrl;
});

// Check if the user is logged in on page load
checkLogin();

