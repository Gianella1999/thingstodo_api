async function fetchTasks(query) {
    const statusMessage = document.getElementById('status-message');
    const noResultsMessage = document.getElementById('no-results-message');
    const resultsList = document.getElementById('results-list');
    const resultTitle = document.getElementById('result-title');

    // Reset UI
    statusMessage.style.display = 'block';
    noResultsMessage.style.display = 'none';
    resultsList.innerHTML = '';
    resultTitle.innerText = 'Search Results';

    try {
        // Updated to use the Barcelona Open Data API
        // Note: Adding a 'q' parameter for searching as it's a standard for this type of search
        const response = await fetch(`https://opendata-ajuntament.barcelona.cat/data/api/3/action/package_search?rows=1000&q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        statusMessage.style.display = 'none';

        // This API often returns data in a 'results' property
        const items = data.results || (Array.isArray(data) ? data : []);

        if (items.length === 0) {
            noResultsMessage.style.display = 'block';
            noResultsMessage.innerText = 'No results found.';
        } else {
            renderResults(items);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        statusMessage.style.display = 'none';
        noResultsMessage.style.display = 'block';
        noResultsMessage.innerText = 'Error fetching data. Please ensure the API is accessible.';
    }
}

function renderResults(items) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        // Mapping the results to the UI
        // Since the data structure of this API might vary, we'll try to find relevant fields
        const title = item.title || item.name || 'Untitled Item';
        const description = item.description || item.summary || '';
        const id = item.id || 'N/A';
        const imgUrl = item.image || 'https://via.placeholder.com/150';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${title}">
            <div class="item-info">
                <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${title}</h3>
                <p style="font-size: 0.9rem; color: #666;">ID: ${id}</p>
                <p style="font-size: 0.8rem; color: #888;">${description.substring(0, 100)}...</p>
            </div>
        `;
        resultsList.appendChild(card);
    });
}

// Event Listeners
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query.trim() === '') {
        fetchTasks('');
    } else {
        fetchTasks(query);
    }
});

// Allow pressing "Enter" to search
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-button').click();
    }
});
