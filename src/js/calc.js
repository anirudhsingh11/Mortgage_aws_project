function loadCalculationLogic() {
    const calcForm = document.getElementById('calcForm');
    
    calcForm.onsubmit = async (event) => {
        event.preventDefault();
        
        const principal = document.getElementById('loanAmount').value;
        const annual_rate = document.getElementById('interestRate').value;
        const term_years = document.getElementById('loanTerm').value;
        const idToken = sessionStorage.getItem('id_token');
        
        if (!idToken) {
            alert('Unauthorized. Please log in.');
            window.location.href = 'index.html';
            return;
        }

        // Show loading state
        const calcResult = document.getElementById('calcResult');
        calcResult.innerText = 'Calculating...';
        calcResult.className = 'result-container';
        
        // Build URL with query parameters
        const params = new URLSearchParams({
            principal: Number(principal),
            annual_rate: Number(annual_rate),
            term_years: Number(term_years)
        });
        
        const apiUrl = `https://n98t1xn6v7.execute-api.ap-south-1.amazonaws.com/Mortgage-api/get-calc?${params.toString()}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': idToken,
                    'Content-Type': 'application/json'
                }
                // Removed body since it's a GET request
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            calcResult.innerText = `Monthly Payment: ${data}`;
            calcResult.className = 'result-container success';
        } catch (error) {
            console.error('Calculation error:', error);
            calcResult.innerText = 'Error calculating payment. Please try again.';
            calcResult.className = 'result-container error';
        }
    };
}

window.loadCalculationLogic = loadCalculationLogic;
  