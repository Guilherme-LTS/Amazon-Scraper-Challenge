import './style.css';

// 1. DOM ELEMENT SELECTION
const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword-input');
const resultsContainer = document.querySelector('#results-container');
const loadingIndicator = document.querySelector('#loading');
const errorMessageDiv = document.querySelector('#error-message');

// 2. MAIN FUNCTION TO HANDLE FORM SUBMISSION
const handleSubmit = async (event) => {
  // Prevents the default page reload on form submission
  event.preventDefault(); 
  
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    renderError('Please enter a search term.');
    return;
  }

  // Prepare the UI for a new search
  showLoading(true);
  clearResultsAndErrors();

  try {
    // 3. MAKE THE API CALL TO THE BACKEND
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    // Check if the network response was successful
    if (!response.ok) {
      const errorData = await response.json();
      // Throws an error to be caught by the catch block
      throw new Error(errorData.error || 'A server error occurred.');
    }

    const products = await response.json();

    // 4. RENDER THE RESULTS
    if (products.length === 0) {
      renderError('No products found. Please try a different term.');
    } else {
      renderProducts(products);
    }

  } catch (error) {
    // Catches network errors or errors we threw manually
    console.error('Error fetching data:', error);
    renderError(error.message);
  } finally {
    // Ensures the loading indicator is hidden at the end
    showLoading(false);
  }
};

// 5. UI HELPER FUNCTIONS

// Clears previous results and error messages
function clearResultsAndErrors() {
  resultsContainer.innerHTML = '';
  errorMessageDiv.innerHTML = '';
  errorMessageDiv.classList.add('hidden');
}

// Controls the visibility of the loading indicator
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Displays an error message on the screen
function renderError(message) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove('hidden');
}

// Creates and inserts the product cards into the page
function renderProducts(products) {
  const productCards = products.map(product => `
    <div class="product-card">
      <img src="${product.imageUrl}" alt="${product.title}">
      <h3>${product.title}</h3>
      <div class="rating">
        <span>⭐ ${product.rating} (${product.numReviews.toLocaleString('en-US')} reviews)</span>
      </div>
    </div>
  `).join('');

  resultsContainer.innerHTML = productCards;
}

// 6. ADD THE EVENT LISTENER TO THE FORM
searchForm.addEventListener('submit', handleSubmit);