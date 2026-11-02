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
        // Using the base URL and common 'tasks' endpoint
        // Note: The actual endpoint might vary, adjust as needed per documentation
        const response = await fetch(`https://thingstodoapi.com/api/tasks?search=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        statusMessage.style.display = 'none';

        if (data.length === 0) {
            noResultsMessage.style.display = 'block';
            noResultsMessage.innerText = 'No elements found.';
        } else {
            renderResults(data);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        statusMessage.style.display = 'none';
        noResultsMessage.style.display = 'block';
        noResultsMessage.innerText = 'Error fetching data. Please try again later.';
    }
}

function renderResults(tasks) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'item-card';

        // Handling missing image or property
        const imgUrl = task.image || 'https://via.placeholder.com/150';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${task.title || 'Task Image'}">
            <div class="item-info">
                <h3>${task.title || 'Untitled Task'}</h3>
                <p>ID: ${task.id} | Type: ${task.type || 'N/A'}</p>
            </div>
        `;
        resultsList.appendChild(card);
    });
}

// Event Listeners
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query.trim() === '') {
        // If empty, maybe show all or do nothing
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
