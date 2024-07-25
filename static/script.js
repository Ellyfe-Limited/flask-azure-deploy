// script.js
function calculateHydration() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const tbw = document.getElementById('tbw').value;

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age, height, weight, gender, tbw }),
    })
    .then(response => response.json())
    .then(data => {
        // Clear previous results
        document.getElementById('status-smiley').src = '';
        document.getElementById('hydration-status').innerHTML = '';

        const statusSmiley = document.getElementById('status-smiley');
        const hydrationStatus = document.getElementById('hydration-status');

        if (data.status === 'Dehydrated') {
            statusSmiley.src = '/static/images/dehydrated.gif'; // Update with actual path
            hydrationStatus.textContent = 'Dehydrated';
        } else if (data.status === 'Mild-Dehydrated') {
            statusSmiley.src = '/static/images/milddehydrated.gif'; // Update with actual path
            hydrationStatus.textContent = 'Mildly Dehydrated';
        } else {
            statusSmiley.src = 'static/images/hydrated.gif'; // Update with actual path
            hydrationStatus.textContent = 'Hydrated';
        }

        document.getElementById('result-card').style.display = 'block';
    });
}

function exportData() {
    fetch('/export', {
        method: 'GET',
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'hydration_data.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}
