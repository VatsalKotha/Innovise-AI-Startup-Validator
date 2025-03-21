import os
import requests
from flask import Flask, request, send_from_directory
from twilio.rest import Client
from fpdf import FPDF
from pyngrok import ngrok

app = Flask(__name__)

# Twilio credentials
TWILIO_ACCOUNT_SID = "AC6fd66028fa5c3d52237fd1935c73962b"
TWILIO_AUTH_TOKEN = "057a63dc63c4f2c7a963cef5cd16b1d3"
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# AI API Endpoint
AI_MODEL_URL = "http://192.168.0.120:8021/predict"



# Store user responses
user_sessions = {}

# Questions & Choices
questions = [
    "What’s your *Startup Name*?",
    "What *problem* does your startup address?\n1) Inefficient Processes\n2) High Costs\n3) Lack of Access to Information\n4) Poor User Experience\n5) Health Issues\n6) Environmental Concerns",
    "What makes your startup unique?\n1) Innovative Technology\n2) Sustainability\n3) Cost-Effective Solution\n4) Superior Quality\n5) Niche Market Focus\n6) Exceptional Customer Service",
    "Who is your *Target Audience*?\n1) B2B\n2) B2C\n3) SMEs\n4) Enterprises\n5) Millennials\n6) Gen Z",
    "What *Industry* do you operate in?\n1) Technology\n2) Healthcare\n3) Finance\n4) Education\n5) Retail\n6) Agriculture\n7) Entertainment\n8) E-Commerce\n9) Others",
    "Where is your startup based? (*City, Country*)",
    "How many people are on your team?\n1) 1-5\n2) 6-10\n3) 11-20\n4) 21-50\n5) 51-100\n6) 100+",
    "What is your *Founding Team’s Background*?\n1) Technical Expertise\n2) Business Experience\n3) Industry-Specific Knowledge\n4) Marketing & Sales",
    "What *Stage* are you in?\n1) Idea\n2) Early\n3) Growth\n4) Established",
    "What *Revenue Model* do you use?\n1) Subscription\n2) Direct Sales\n3) Advertising\n4) Transaction Fees\n5) Freemium"
]

# Choice mappings
choice_mappings = {
    1: ["Inefficient Processes", "High Costs", "Lack of Access to Information", "Poor User Experience", "Health Issues", "Environmental Concerns"],
    2: ["Innovative Technology", "Sustainability", "Cost-Effective Solution", "Superior Quality", "Niche Market Focus", "Exceptional Customer Service"],
    3: ["B2B", "B2C", "SMEs", "Enterprises", "Millennials", "Gen Z"],
    4: ["Technology", "Healthcare", "Finance", "Education", "Retail", "Agriculture", "Entertainment", "E-Commerce", "Others"],
    6: ["1-5", "6-10", "11-20", "21-50", "51-100", "100+"],
    7: ["Technical Expertise", "Business Experience", "Industry-Specific Knowledge", "Marketing & Sales"],
    8: ["Idea", "Early", "Growth", "Established"],
    9: ["Subscription", "Direct Sales", "Advertising", "Transaction Fees", "Freemium"]
}

@app.route("/whatsapp", methods=["POST"])
def whatsapp_bot():
    sender = request.form.get("From")
    message_body = request.form.get("Body").strip()

    if sender not in user_sessions:
        user_sessions[sender] = {"step": 0, "data": {}}

    session = user_sessions[sender]
    step = session["step"]

    # Handle choice-based questions
    if step in choice_mappings:
        try:
            choice_index = int(message_body) - 1
            if 0 <= choice_index < len(choice_mappings[step]):
                message_body = choice_mappings[step][choice_index]
            else:
                send_whatsapp_message(sender, "⚠️ Invalid choice. Please reply with a number.")
                return "OK"
        except ValueError:
            send_whatsapp_message(sender, "⚠️ Please reply with a number.")
            return "OK"

    # Store user response
    session["data"][step] = message_body
    session["step"] += 1

    # Send next question or generate PDF
    if session["step"] < len(questions):
        send_whatsapp_message(sender, questions[session["step"]])
        return "OK"

    # AI API Call
    ai_payload = {key: session["data"].get(i, "") for i, key in enumerate([
        "startup_name", "problem", "usp", "target_segment", "industry", "location",
        "team_size", "founding_team_background", "stage", "revenue_model"
    ])}

    ai_response = requests.post(AI_MODEL_URL, json=ai_payload)
    ai_result = ai_response.json() if ai_response.status_code == 200 else None

    # Generate & send PDF
    pdf_path = generate_pdf(sender, ai_payload, ai_result)
    send_whatsapp_pdf(sender, pdf_path)

    del user_sessions[sender]
    return "OK"

def generate_pdf(sender, user_data, ai_data):
    """Generate a PDF and save it locally."""
    pdf = FPDF()
    pdf.add_page()
    
    # Use a Unicode-compatible font like 'Arial Unicode MS' (if installed) or DejaVuSans
    pdf.add_font("DejaVu", "", "DejaVuSans.ttf", uni=True)
    pdf.set_font("DejaVu", "", 12)

    
    pdf.cell(200, 10, "Idea Validation Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("DejaVu", "", 12)
    for key, value in user_data.items():
        pdf.cell(200, 10, f"{key}: {value}", ln=True)

    pdf.ln(10)
    if ai_data:
        pdf.cell(200, 10, f"Success Score: {ai_data['success_score']}%", ln=True)
        pdf.multi_cell(0, 10, f"Final Verdict: {ai_data['final_verdict']}")

    pdf.ln(10)
    pdf.cell(200, 10, "Get More Insights for FREE on the Innovise App!", ln=True, align="C")  # Removed Emoji

    pdf_path = f"reports/{sender.replace(':', '_')}.pdf"
    pdf.output(pdf_path)
    return pdf_path


def send_whatsapp_pdf(to, pdf_path):
    """Send PDF via Twilio WhatsApp."""
    file_url = f"https://5774-103-93-195-194.ngrok-free.app/{pdf_path}"
    client.messages.create(from_=TWILIO_WHATSAPP_NUMBER, media_url=[file_url], to=to)

def send_whatsapp_message(to, message):
    """Send WhatsApp text message."""
    client.messages.create(from_=TWILIO_WHATSAPP_NUMBER, body=message, to=to)

@app.route("/reports/<path:filename>", methods=["GET"])
def download_file(filename):
    """Serve the PDF file over ngrok."""
    return send_from_directory("reports", filename)

if __name__ == "__main__":
    os.makedirs("reports", exist_ok=True)
    app.run(port=8282, host="0.0.0.0", debug=True)