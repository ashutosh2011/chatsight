from flask import Blueprint, request, jsonify, render_template
from .analysis.chat_analysis import analyze_chat, get_analysis_results
import uuid 

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload', methods=['POST'])
def upload_chat():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        analysis_result = analyze_chat(file) 
        # Assuming analyze_chat returns a dict with an 'analysis_uid' key among the results
        if analysis_result.get("analysis_uid"):
            return jsonify({"success": True, "data": analysis_result}), 200
        else:
            return jsonify({"error": "Analysis failed"}), 500
    return jsonify({"error": "Invalid file"}), 400

@main.route('/analysis/<analysis_uid>', methods=['GET'])
def get_analysis(analysis_uid):
    if not analysis_uid or not is_valid_uuid(analysis_uid):
        return jsonify({"error": "Invalid analysis UID"}), 400
    
    try:
        analysis_results = get_analysis_results(analysis_uid)
        if analysis_results:
            return jsonify({"success": True, "data": analysis_results}), 200
        else:
            return jsonify({"error": "Analysis results not found"}), 404
    except Exception as e:
        # Log the error here
        print(e)
        return jsonify({"error": "Internal server error"}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'txt'}

def is_valid_uuid(uuid_to_test, version=4):
    try:
        uuid_obj = uuid.UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test
