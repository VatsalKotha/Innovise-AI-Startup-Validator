
Web:
https://innovise.live

Backend:
https://backend.innovise.live

AI:
https://ai.innovise.live

# Innovise: AI-Powered Startup Validator Platform

## 🚀 Overview
Innovise is an intelligent, AI-driven platform designed to predict startup success, generate actionable competitor insights, and validate market viability. By leveraging advanced machine learning models and large language models, Innovise equips founders, strategists, and investors with data-driven tools to evaluate and refine their business models.

## ✨ Key Features
* **Startup Success Prediction:** Evaluates critical business metrics and market conditions to forecast long-term viability.
* **Competitor Insights:** Automates deep competitive landscape analysis and market research.
* **Intelligent Recommendations:** Suggests strategic pivots, ideal market niches, and relevant case studies using an advanced retrieval and ranking pipeline.
* **Explainable AI (XAI):** Ensures transparent and interpretable AI predictions using SHAP and LIME methodologies.
* **Cross-Platform Access:** Accessible via a responsive web interface and a mobile application.

## 🛠️ Tech Stack
* **Frontend:** Next.js (Web), Flutter (Mobile)
* **Backend & Database:** MongoDB, JWT Authentication
* **AI/ML Engine:** Python, Llama 3.3 70B (via Groq)
* **Vector Search & Ranking:** Pinecone, Reciprocal Rank Fusion (RRF), Cross-Encoder BGE

## 📄 Research & Publications
The architecture and methodologies powering this repository are backed by peer-reviewed research. We have detailed our approach to utilizing LLMs, retrieval-augmented systems, and explainable validation metrics in our published paper in the **MMEP (Mathematical Modelling of Engineering Problems) journal by IIETA**. 

> **Read the Paper:** https://www.irjet.net/archives/V13/i3/IRJET-V13I03214.pdf

## 💻 Getting Started

### Prerequisites
* Node.js (v16+)
* Python (3.9+)
* MongoDB Instance
* API Keys: Groq, Pinecone

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/VatsalKotha/Innovise-AI-Startup-Validator.git](https://github.com/VatsalKotha/Innovise-AI-Startup-Validator.git)
    cd Innovise-AI-Startup-Validator/innovise
    ```
2.  **Set up the environment variables:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    MONGO_URI=your_mongodb_uri
    GROQ_API_KEY=your_groq_api_key
    PINECONE_API_KEY=your_pinecone_api_key
    JWT_SECRET=your_jwt_secret
    ```
3.  **Install dependencies and run the application:**
    ```bash
    npm install
    npm run dev
    ```

## 🤝 Contributing
We welcome contributions! Whether it's integrating new XAI techniques, improving the ranking algorithms, or fixing UI bugs, please feel free to open a Pull Request.

## 📜 License
This project is licensed under the [MIT License](LICENSE).
