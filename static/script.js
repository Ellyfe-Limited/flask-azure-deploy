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
        document.getElementById('progress-circle').innerHTML = '';
        document.getElementById('hydration-status').innerHTML = '';

        const progressCircle = new ProgressBar.Circle('#progress-circle', {
            color: '#aaa',
            strokeWidth: 10,
            trailWidth: 5,
            easing: 'easeInOut',
            duration: 1400,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#FFEA82', width: 10 },
            to: { color: data.status === 'Hydrated' ? '#00ff00' : data.status === 'Mild-Dehydrated' ? '#ffff00' : '#ff0000', width: 10 },
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                if (value === 0) {
                    circle.setText('');
                } else {
                    circle.setText(data.percentage.toFixed(2) + '%');
                }
            }
        });

        progressCircle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        progressCircle.text.style.fontSize = '2rem';

        progressCircle.animate(data.percentage / 100);

        const hydrationStatus = document.getElementById('hydration-status');
        hydrationStatus.innerHTML = `<h2 class="text-${data.status === 'Hydrated' ? 'success' : data.status === 'Mild-Dehydrated' ? 'warning' : 'danger'}">${data.status}</h2>`;

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
