# EcoVision - E-Waste Classification System

A full-stack image classification platform that identifies types of electronic waste using Deep Learning (CNN), SVM, and Random Forest models. The system enables real-time image classification with model selection, live prediction, and result storage.

---

## 📌 Features

- Upload e-waste images for classification
- AI classification with trained models: CNN, SVM, Random Forest
- View predictions with e-waste object, it's category & hazardous elements contained by that perticular e-waste
- Interactive persnolized dashboard and history details
- Eco-tips for disposal and recycle 
- E-quiz for user engagement 
- Report generation with downloadable functions
- Certificate generation for awarenerss and enthusiast activists
- Admin panel for system management 
- Provided voice assistant for local users  
- MongoDB database logging
- Intuitive React-based UI

---

## 🛠️ Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | React.js               |
| Backend     | Node.js + Express      |
| ML API      | Flask (Python)         |
| ML Models   | CNN, SVM, Random Forest|
| Database    | MongoDB (MongoDB Atlas)|
| Dataset     | Kaggle E-Waste Dataset |

---

## 📁 Project Structure

```bash
e-waste-classifier/
├── project/               # React frontend
├── server/               # Node + Express backend
├── api/                  # Flask model API
├── models/               # Jupyter notebooks / training code
└── README.md
🚀 Getting Started
1️⃣ Frontend Setup
bash

cd client
npm install
npm start
Runs at: http://localhost:3000

2️⃣ Backend Setup
bash

cd server
npm install
Create .env in server/:

env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
FLASK_API_URL=http://localhost:5001/predict
Start backend server:

bash

node index.js

3️⃣ ML API (Flask) Setup
bash

cd api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
python app.py
Runs at: http://localhost:5001

4️⃣ Training Models (optional)
Navigate to models/:

bash

cd models
pip install -r requirements.txt
Train models:

bash

python train_cnn.py        # CNN
python train_svm_rf.py     # SVM & Random Forest
Weights saved in /saved_models

📡 How It Works
User uploads an image via UI
Frontend sends it to Node.js backend
Backend sends request to Flask API (/predict)
Flask returns label & confidence
MongoDB stores metadata
Frontend displays results

📊 Model Performance
Model	Accuracy (Est.)
CNN	~91-92%
SVM	~86-87%
Random Forest	~84-85%

🧪 API Example
POST /predict
Form Data:

image: image file (jpg/png)

model: cnn | svm | randomforest

Response:

json

{
  "prediction": "Battery",
  "confidence": 93.2
}

📦 Dataset Info
Source: Kaggle E-Waste Image Dataset

Images: ~5000+ categorized

Format: .jpg, .png

Classes: Laptop, Battery, Mobile, Keyboard, etc.

👤 Developed By
Neeja Suva

Full Stack & ML Developer

GitHub - github.com/11neeja 
LinkedIn - www.linkedin.com/in/neeja-suva-1212121212121212121/

📜 License
MIT License — feel free to use, fork, and modify!

⭐ Give a Star
If this project helped you or inspired your work, please consider giving it a ⭐ on GitHub!
