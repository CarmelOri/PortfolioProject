const apiKey = "a8c0f3d4fdd457348ccb7bce";

async function getCurrenciesCodes() {
    try {
        let response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/codes`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let codes = data.supported_codes.map((item) => item[0]);
        return codes;
    } catch (error) {
        console.log("Error fetching currency codes:", error);
    }
}

async function populateSelectors() {
    let codes = await getCurrenciesCodes();
    if (!codes) {
        console.error("Failed to fetch currency codes.");
        return;
    }
    let fromSelector = document.getElementById("from-currency");
    let toSelector = document.getElementById("to-currency");
    codes.forEach((code) => {
        let newOption = `<option value="${code}">${code}</option>`;
        fromSelector.innerHTML += newOption;
        toSelector.innerHTML += newOption;
    });
}


async function convert(amount, from, to) {
    try {
        let response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let rate = data.conversion_rates[to];
        if (!rate) {
            throw new Error(`Conversion rate for ${to} not found.`);
        }
        return rate * amount;
    } catch (error) {
        console.log("Error during conversion:", error);
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    populateSelectors();


    document.getElementById("convert").addEventListener("click", async () => {
        let amount = document.getElementById("amount").value;
        let fromCurrency = document.getElementById("from-currency").value;
        let toCurrency = document.getElementById("to-currency").value;

        if (amount === "" || isNaN(amount)) {
            alert("Please enter a valid amount");
            return;
        }

        let result = await convert(amount, fromCurrency, toCurrency);

        if (result) {
            document.getElementById("result").textContent = `Converted amount: ${result.toFixed(2)}`;
        } else {
            document.getElementById("result").textContent = "Conversion failed. Please try again.";
        }
    });
});




