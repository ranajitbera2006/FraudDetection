# VerifAI — Intelligent UPI Fraud Detection System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://verifai-ye2w.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-FraudDetection-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ranajitbera2006/FraudDetection.git)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Python](https://img.shields.io/badge/Python_3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**VerifAI** is a real-time full-stack fraud prevention platform tailored for UPI transactions[cite: 2]. By bridging an interactive web dashboard with an automated machine learning classification pipeline, VerifAI analyzes sender histories, recipient markers, balances, and transfer amounts to flag potentially malicious financial activity prior to settlement[cite: 2].

---

## Architecture Overview

VerifAI runs on a hybrid micro-architecture that decouples client rendering, API coordination, and data science model execution:

```
[ Client: React 19 + Vite + DaisyUI ]
                  │
                  ▼ (HTTPS / JSON API)
[ Node.js & Express 5 API Gateway ] ── (Mongoose ODM) ──► [ MongoDB Atlas ]
                  │
                  ▼ (Subprocess / IPC Bridge)
[ Python ML Engine: Scikit-Learn + Feature-Engine ]
```

1. **Frontend Layer**: Built with React 19, Tailwind CSS v4, and DaisyUI 5, providing real-time client-side validation, reactive forms, and toast notifications[cite: 2].
2. **Gateway Layer**: An Express 5 backend managing request routing, cross-origin orchestration (`cors`), persistence verification, and child-process lifecycle control.
3. **Machine Learning Pipeline**: Trained analytical workflows using Scikit-Learn, Feature-Engine, Pandas, and Joblib to compute fraud likelihood scores based on financial behavioral vectors.
4. **Data Persistence**: MongoDB Atlas cluster storing transaction records, audit logs, and inference history.

---

## Tech Stack

| Domain | Technology / Framework | Key Dependencies |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8 | Tailwind CSS v4, DaisyUI v5, React Hot Toast, React Icons[cite: 2] |
| **Backend API** | Node.js (ES Modules), Express v5 | Mongoose v9, Dotenv, CORS, Concurrently |
| **Data Science / ML** | Python >= 3.14 | Scikit-Learn, Feature-Engine, Pandas, NumPy, Joblib, PyMongo |
| **Database** | MongoDB Atlas | Cloud Cluster Deployment |
| **Hosting & CI/CD** | Render | Static Site (Client) + Web Service (Backend) |

---

## Project Structure

```text
FraudDetection/
├── backend/
│   ├── db/
│   │   └── connectDB.js          # MongoDB connection handler
│   ├── routes/
│   │   └── sender.route.js       # Transaction evaluation endpoints
│   └── index.js                  # Express API gateway entry point
├── frontend/
│   ├── public/                   # Static branding assets
│   ├── src/
│   │   ├── components/           # UI forms and visualization cards
│   │   ├── App.jsx               # Application shell
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html
│   ├── package.json              # Frontend client dependencies
│   └── vite.config.js            # Build and development proxy config
├── src/
│   ├── DB/                       # Database repository & service scripts
│   ├── EDA/                      # Exploratory data analysis notebooks
│   ├── Main/                     # Core execution routines
│   └── models/                   # Serialized ML artifacts (.joblib / .pkl)
├── .env.example                  # Environment key definitions
├── package.json                  # Root runner & backend package configuration
├── pyproject.toml                # Python project and ML dependency definitions
└── README.md
```

---

## Getting Started

### Prerequisites

* **Node.js**: `v20.x` or higher
* **Python**: `v3.12` to `v3.14`
* **MongoDB**: Active MongoDB Atlas cluster URI

---

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ranajitbera2006/FraudDetection.git](https://github.com/ranajitbera2006/FraudDetection.git)
   cd FraudDetection
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@clusterupi.4mnqtl2.mongodb.net/?appName=ClusterUPI
   ```

3. **Install Backend & Shared Dependencies:**
   ```bash
   npm install
   ```

4. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Install Python ML Dependencies:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate

   pip install -e .
   ```

---

### Running Locally

Run both the Express backend and Vite frontend concurrently with a single command from the project root:

```bash
npm run dev
```

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:10000`

---

## Deployment Configuration

* **Live Demo**: [https://verifai-ye2w.onrender.com](https://verifai-ye2w.onrender.com)
* **Backend Service**: Deployed on Render with native dynamic port routing (`0.0.0.0:$PORT`) and environment-level secret management.
* **Atlas Configuration**: Configured with Network Whitelisting (`0.0.0.0/0`) for dynamic cloud hosting environments.

---

## Collaborators

* **Ranajit Bera** — [ranajitbera2006](https://github.com/ranajitbera2006)
* **Pratyush Dinda**