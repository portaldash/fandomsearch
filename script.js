let jsonData = [];
let currentPage = 1;
const perPage = 100;

// Fetch the JSON data from a local file
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        jsonData = await response.json();
        processResults('', '', 'asc'); // Display all data initially
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortSelect').value;
    const order = document.getElementById('orderSelect').value;

    // Filter, sort, and display the results
    processResults(searchTerm, sortBy, order);
});

// Process results: filter, sort, and paginate
function processResults(searchTerm, sortBy, order) {
    let filteredData = jsonData;

    // Filter by search term (searching in "domain" field as an example)
    if (searchTerm) {
        filteredData = jsonData.filter(item =>
            item.domain.toLowerCase().includes(searchTerm)
        );
    }

    // Sort by selected field
    if (sortBy) {
        filteredData.sort((a, b) => {
            if (order === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
    }

    // Paginate results
    const totalResults = filteredData.length;
    const totalPages = Math.ceil(totalResults / perPage);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedData = filteredData.slice(start, end);

    // Display results and update pagination controls
    displayResults(paginatedData);
    updatePaginationControls(totalPages);
}

// Display the results in the UI
function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = 'No results found.';
    } else {
        const table = document.createElement('table');
        table.classList.add('results-table');

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Domain</th>
            <th>Created At</th>
            <th>Articles</th>
            <th>Edits</th>
            <th>Users</th>
            <th>Wiki ID</th>
            <th>Language</th>
        `;
        table.appendChild(headerRow);

        data.forEach(wiki => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${wiki.domain}</td>
                <td>${wiki.created_at}</td>
                <td>${wiki.articles}</td>
                <td>${wiki.edits}</td>
                <td>${wiki.users}</td>
                <td>${wiki.wiki_id}</td>
                <td>${wiki.lang}</td>
            `;
            table.appendChild(row);
        });

        resultsContainer.appendChild(table);
    }
}

// Update pagination controls based on total pages
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => changePage(currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => changePage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

// Change the current page
function changePage(page) {
    currentPage = page;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortSelect').value;
    const order = document.getElementById('orderSelect').value;

    processResults(searchTerm, sortBy, order);
}

// Fetch the data on page load
fetchData();
