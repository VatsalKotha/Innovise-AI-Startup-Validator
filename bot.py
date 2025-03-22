import os
import requests
from flask import Flask, request, send_from_directory
from twilio.rest import Client
from fpdf import FPDF
from pyngrok import ngrok

app = Flask(__name__)

# Twilio credentials
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# AI API Endpoint
AI_MODEL_URL = "https://innovise-ai.onrender.com/predict"

# User session storage
user_sessions = {}

# Questions & Choices
questions = [
    "What’s your *Startup Name*?",
    "What *problem* does your startup address? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Inefficient Processes', 'High Costs', 'Lack of Access to Information', 
        'Poor User Experience', 'Health Issues', 'Environmental Concerns'])]),
    "What makes your startup unique? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Innovative Technology', 'Sustainability', 'Cost-Effective Solution', 
        'Superior Quality', 'Niche Market Focus', 'Exceptional Customer Service'])]),
    "Who is your *target audience*? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'B2B - Business to Business', 'B2C - Business to Consumer', 'SMEs - Small & Medium Enterprises', 
        'Enterprises', 'Millennials', 'Gen Z'])]),
    "What *Industry* do you operate in? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Agriculture', 
        'Entertainment', 'E-Commerce', 'Others'])]),
    "Where is your startup based? (*City, Country*)",
    "How many people are on your team? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        '1-5', '6-10', '11-20', '21-50', '51-100', '100+'])]),
    "What is your founding team’s background? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Technical Expertise', 'Business/Entrepreneurial Experience', 
        'Industry-Specific Knowledge', 'Marketing and Sales'])]),
    "What stage are you currently in? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Idea Stage - Conceptualization', 'Early Stage - MVP Development', 
        'Growth Stage - Scaling Operations', 'Established - Market Expansion'])]),
    "What revenue model does your startup use? \n" + "\n".join([f"{i+1}) {c}" for i, c in enumerate([
        'Subscription Fees', 'Direct Sales', 'Advertising', 'Transaction Fees', 'Freemium'])])
]

# Mapping numerical replies to text values
choice_mappings = {
    1: ['Inefficient Processes', 'High Costs', 'Lack of Access to Information', 'Poor User Experience', 'Health Issues', 'Environmental Concerns'],
    2: ['Innovative Technology', 'Sustainability', 'Cost-Effective Solution', 'Superior Quality', 'Niche Market Focus', 'Exceptional Customer Service'],
    3: ['B2B - Business to Business', 'B2C - Business to Consumer', 'SMEs - Small & Medium Enterprises', 'Enterprises', 'Millennials', 'Gen Z'],
    4: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Agriculture', 'Entertainment', 'E-Commerce', 'Others'],
    6: ['1-5', '6-10', '11-20', '21-50', '51-100', '100+'],
    7: ['Technical Expertise', 'Business/Entrepreneurial Experience', 'Industry-Specific Knowledge', 'Marketing and Sales'],
    8: ['Idea Stage - Conceptualization', 'Early Stage - MVP Development', 'Growth Stage - Scaling Operations', 'Established - Market Expansion'],
    9: ['Subscription Fees', 'Direct Sales', 'Advertising', 'Transaction Fees', 'Freemium']
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
                send_whatsapp_message(sender, "⚠️ Invalid option. Please reply with a valid number.")
                return "OK"
        except ValueError:
            send_whatsapp_message(sender, "⚠️ Please reply with a valid number.")
            return "OK"

    # Store user response
    session["data"][step] = message_body
    session["step"] += 1

    # Send next question or process AI request
    if session["step"] < len(questions):
        send_whatsapp_message(sender, questions[session["step"]])
        return "OK"

    # All inputs collected, prepare AI request
    ai_payload = {
        "startup_name": session["data"].get(0, ""),
        "problem": session["data"].get(1, ""),
        "usp": session["data"].get(2, ""),
        "target_segment": session["data"].get(3, ""),
        "industry": session["data"].get(4, ""),
        "location": session["data"].get(5, ""),
        "team_size": session["data"].get(6, ""),
        "founding_team_background": session["data"].get(7, ""),
        "stage": session["data"].get(8, ""),
        "revenue_model": session["data"].get(9, "")
    }

    # Call AI API
    ai_response = requests.post(AI_MODEL_URL, json=ai_payload)
    
    if ai_response.status_code == 200:
        ai_result = ai_response.json()
        response_text = f"🔍 *Idea Validation Scorecard*\n\n" \
                        f"📊 *Success Score*: {ai_result['success_score']}%\n\n" \
                        f"💡 *Final Verdict*: {ai_result['final_verdict']}\n\n" \
                        f"🚀 Want *more insights & features* for FREE? *Download the Innovise App* now!"
    else:
        response_text = "⚠️ Error in processing your request. Please try again later."

    # Send AI results & promotional message
    send_whatsapp_message(sender, response_text)
    del user_sessions[sender]

    return "OK"

def send_whatsapp_message(to, message):
    """Send a WhatsApp message via Twilio"""
    client.messages.create(
        from_=TWILIO_WHATSAPP_NUMBER,
        body=message,
        to=to
    )

if __name__ == "__main__":
    app.run(port=8282, host="0.0.0.0", debug=True)