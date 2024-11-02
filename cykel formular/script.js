// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the date input and the calendar container
    const dateInput = document.getElementById('date');
    const calendarContainer = document.getElementById('calendarContainer');
    
    // Set the current year to 2024 and get the current month (0-indexed)
    let currentYear = 2024;
    let currentMonth = new Date().getMonth(); // Default to the current month

    // Event listener to display the calendar when the date input is focused
    dateInput.addEventListener('focus', () => {
        generateCalendar(currentYear, currentMonth);
        calendarContainer.style.display = 'block'; // Show the calendar
        calendarContainer.setAttribute('aria-hidden', 'false'); // Make it accessible

        // Position the calendar below the input field
        const rect = dateInput.getBoundingClientRect();
        calendarContainer.style.top = `${rect.bottom + window.scrollY}px`;
        calendarContainer.style.left = `${rect.left + window.scrollX}px`;
    });

    // Function to generate the calendar for a given year and month
    function generateCalendar(year, month) {
        // Ensure the calendar stays within the bounds of the year 2024
        if (year !== 2024) {
            year = 2024;
        }

        // Clear any previous content in the calendar container
        calendarContainer.innerHTML = '';

        // Create the navigation header with month navigation buttons
        const header = document.createElement('div');
        header.className = 'calendar-header';

        // Create the "Previous month" button
        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.setAttribute('aria-label', 'Previous month');
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from hiding the calendar
            if (month > 0) {
                month--; // Go to the previous month
            } else {
                month = 11; // Wrap to December if currently at January
            }
            generateCalendar(year, month); // Regenerate the calendar
        });

        // Create the "Next month" button
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.setAttribute('aria-label', 'Next month');
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from hiding the calendar
            if (month < 11) {
                month++; // Go to the next month
            } else {
                month = 0; // Wrap to January if currently at December
            }
            generateCalendar(year, month); // Regenerate the calendar
        });

        // Create the month label showing the current month and year
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthLabel = document.createElement('span');
        monthLabel.textContent = `${monthNames[month]} ${year}`;
        monthLabel.className = 'month-label';

        // Append navigation buttons and label to the header
        header.appendChild(prevButton);
        header.appendChild(monthLabel);
        header.appendChild(nextButton);
        calendarContainer.appendChild(header);

        // Create the calendar table structure
        const table = document.createElement('table');
        table.setAttribute('role', 'grid');
        const headerRow = document.createElement('thead');
        const daysRow = document.createElement('tr');
        daysRow.setAttribute('role', 'row');

        // Create table headers for the days of the week
        const monthDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        monthDays.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            th.setAttribute('role', 'columnheader');
            daysRow.appendChild(th);
        });

        headerRow.appendChild(daysRow);
        table.appendChild(headerRow);

        const body = document.createElement('tbody');

        // Calculate the first day of the month and total number of days in the month
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        let date = 1;
        // Generate rows and cells for the calendar
        for (let i = 0; i < 6; i++) { // Loop for up to 6 weeks
            const row = document.createElement('tr');
            row.setAttribute('role', 'row');

            for (let j = 0; j < 7; j++) { // Loop for each day of the week
                const cell = document.createElement('td');
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '-1');

                // Add empty cells for days before the first of the month or after the last day
                if ((i === 0 && j < firstDay) || date > totalDays) {
                    cell.textContent = '';
                    cell.setAttribute('aria-disabled', 'true'); // Indicate non-selectable cells
                } else {
                    // Populate cells with valid dates
                    cell.textContent = date;
                    cell.setAttribute('tabindex', '0');
                    cell.setAttribute('aria-label', `Select ${date} ${monthNames[month]}, ${year}`);
                    cell.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent the click from hiding the calendar
                        // Format the date in YYYY-MM-DD and set it in the input
                        dateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                        calendarContainer.style.display = 'none'; // Hide the calendar
                        calendarContainer.setAttribute('aria-hidden', 'true');
                    });
                    cell.addEventListener('keydown', (e) => {
                        // Handle keyboard interaction (Enter or Space key)
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            cell.click();
                        }
                    });
                    date++; // Increment the date
                }

                row.appendChild(cell); // Append cell to the row
            }

            body.appendChild(row); // Append row to the table body
        }

        table.appendChild(body); // Append body to the table
        calendarContainer.appendChild(table); // Append table to the calendar container

        // Focus the first available date when calendar is displayed
        const firstAvailableDate = calendarContainer.querySelector('td[tabindex="0"]');
        if (firstAvailableDate) {
            firstAvailableDate.focus();
        }
    }

    // Event listener to hide the calendar when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!calendarContainer.contains(e.target) && e.target !== dateInput) {
            calendarContainer.style.display = 'none'; // Hide the calendar
            calendarContainer.setAttribute('aria-hidden', 'true');
        }
    });

    // Event listener to hide the calendar when pressing the Escape key
    dateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            calendarContainer.style.display = 'none'; // Hide the calendar
            calendarContainer.setAttribute('aria-hidden', 'true');
        }
    });
});
