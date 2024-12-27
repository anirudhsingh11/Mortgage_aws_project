const cognitoDomain = "ap-south-17dbzd8qbd.auth.ap-south-1.amazoncognito.com"; 
const clientId = "4r3fhmqmqdspv1uq975m2qm270"; 
const redirectUri = "http://localhost:8000/callback.html";
const userApiUrl = "https://n98t1xn6v7.execute-api.ap-south-1.amazonaws.com/Mortgage-api//get-user";

async function fetchUserData(idToken) {
    try {
        console.log('ID Token being sent:', idToken);

        const response = await fetch(userApiUrl, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                requestContext: {
                    resourcePath: "/user",
                    httpMethod: "GET"
                },
                body: null
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        const userData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        console.log('Parsed User Data:', userData);
        
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

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

  