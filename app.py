from flask import Flask, request, jsonify, send_file, render_template
import pandas as pd
from io import BytesIO

app = Flask(__name__)
data = []


def calculate_baseline_tbw(age, height, weight, gender):
    if gender.lower() == 'male':
        tbw = 2.447 - 0.09156 * float(age) + 0.1074 * float(height) + 0.3362 * float(weight)
    elif gender.lower() == 'female':
        tbw = -2.097 + 0.1069 * float(height) + 0.2466 * float(weight)
    else:
        raise ValueError("Gender must be 'male' or 'female'")
    return tbw


def predict_hydration_status(tbw, baseline_tbw):
    percentage = (tbw / baseline_tbw) * 100
    if percentage < 95:
        status = "Dehydrated"
    elif 95 <= percentage < 97:
        status = "Mild-Dehydrated"
    else:
        status = "Hydrated"
    return percentage, status


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    user_data = request.json
    age = user_data['age']
    height = user_data['height']
    weight = float(user_data['weight'])
    gender = user_data['gender']
    user_tbw = float(user_data['tbw'])

    baseline_tbw = calculate_baseline_tbw(age, height, weight, gender)
    percentage, status = predict_hydration_status(user_tbw, baseline_tbw)

    # Store the data for export
    data.append({
        'Age': age,
        'Height': height,
        'Weight': weight,
        'Gender': gender,
        'TBW': user_tbw,
        'Baseline TBW': baseline_tbw,
        'Hydration Percentage': percentage,
        'Hydration Status': status
    })

    return jsonify({
        'percentage': percentage,
        'status': status
    })


@app.route('/export', methods=['GET'])
def export():
    df = pd.DataFrame(data)
    output = BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='HydrationData')
    writer.close()
    output.seek(0)
    return send_file(output, download_name='hydration_data.xlsx', as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
