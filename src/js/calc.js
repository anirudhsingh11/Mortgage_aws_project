function loadCalculationLogic() {
    const calcForm = document.getElementById('calcForm');
    let paymentChart = null;

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculatePayoffDate(term_years) {
        const today = new Date();
        const payoffDate = new Date(today.getFullYear() + term_years, today.getMonth(), 1);
        return payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    function updateChart(principal, interest) {
        const ctx = document.getElementById('paymentChart').getContext('2d');
        
        if (paymentChart) {
            paymentChart.destroy();
        }

        paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: ['#2196F3', '#4CAF50'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    function updateResults(data) {
        const homePrice = Number(document.getElementById('homePrice').value);
        const downPaymentPercent = Number(document.getElementById('downPayment').value);
        const downPaymentAmount = homePrice * (downPaymentPercent / 100);
        const loanAmount = homePrice - downPaymentAmount;
        const term_years = Number(document.getElementById('loanTerm').value);
        
        const monthlyPayment = data.mortgage_payment;
        const totalPayments = monthlyPayment * (term_years * 12);
        const totalInterest = totalPayments - loanAmount;

        // Update all result fields
        document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
        document.getElementById('housePriceResult').textContent = formatCurrency(homePrice);
        document.getElementById('loanAmountResult').textContent = formatCurrency(loanAmount);
        document.getElementById('downPaymentResult').textContent = formatCurrency(downPaymentAmount);
        document.getElementById('totalPaymentsResult').textContent = formatCurrency(totalPayments);
        document.getElementById('totalInterestResult').textContent = formatCurrency(totalInterest);
        document.getElementById('payoffDateResult').textContent = calculatePayoffDate(term_years);

        // Update the pie chart
        const principalPercent = (loanAmount / totalPayments) * 100;
        const interestPercent = (totalInterest / totalPayments) * 100;
        updateChart(principalPercent, interestPercent);
    }
    
    calcForm.onsubmit = async (event) => {
        event.preventDefault();
        
        const homePrice = document.getElementById('homePrice').value;
        const downPaymentPercent = document.getElementById('downPayment').value;
        const principal = homePrice * (1 - downPaymentPercent / 100);
        const annual_rate = document.getElementById('interestRate').value;
        const term_years = document.getElementById('loanTerm').value;
        const idToken = sessionStorage.getItem('id_token');
        
        if (!idToken) {
            alert('Unauthorized. Please log in.');
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('monthlyPayment').textContent = 'Calculating...';
        
        try {
            const response = await fetch('https://n98t1xn6v7.execute-api.ap-south-1.amazonaws.com/Mortgage-api//get-calc', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    body: JSON.stringify({
                        principal: Number(principal),
                        annual_rate: Number(annual_rate),
                        term_years: Number(term_years)
                    }),
                    requestContext: {
                        resourcePath: "/calculate_mortgage",
                        httpMethod: "POST"
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const responseBody = JSON.parse(data.body);
            updateResults(responseBody);
        } catch (error) {
            console.error('Calculation error:', error);
            document.getElementById('monthlyPayment').textContent = 'Error';
        }
    };
}

window.loadCalculationLogic = loadCalculationLogic;
  