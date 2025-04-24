# 🌍 TravelScope

**TravelScope** is an AI-powered travel recommendation application that helps users discover ideal destinations based on their **budget** and **current location**. It leverages AI to estimate transportation costs and provides in-depth destination details for smarter travel planning.

---

## 🚀 Live Demo

- **Frontend**: [TravelScope on Vercel](https://travel-scope.vercel.app/)
- **Backend**: [API hosted on Render](https://travel-scope.onrender.com/)

---

## ✨ Features

- 🎯 **Smart Budget + Location Input**: Enter your travel budget and current city to get tailored suggestions.
- 🧠 **AI Recommendations**: Intelligent destination suggestions powered by Gemini API.
- 🗽 **Destination Cards**: Visually rich cards with highlights about each location.
- 🚆 **Transport Cost Estimates**: Get estimates for bus/train fares to each location.
- 📌 **Detailed Destination Info**: Find insights on hotels, attractions, food, and local tips.
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile experiences.

---

## 🛠️ Tech Stack

### Frontend

- **React**: Modern frontend framework
- **Tailwind CSS**: Utility-first CSS for fast styling
- **shadcn/ui**: Accessible component library
- **lucide-react**: Sleek, open-source icon set
- **React Router**: SPA routing and navigation
- **React Query**: Powerful data fetching and caching

### Backend

- **FastAPI**: High-performance Python API framework
- **Uvicorn**: Lightning-fast ASGI server
- **httpx**: Async HTTP client for external API calls
- **python-dotenv**: Load environment variables
- **pydantic**: Data parsing and validation
- **Gemini API**: Provides AI-based travel data and recommendations

---

## ⚙️ Getting Started

### 🖥️ Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Anandtech09/travel-scope.git
cd travel-scope

# Install dependencies
npm install

# Run the development server
npm run dev

# Open your browser
http://localhost:8080
```

### 🔧 Backend Setup

```bash
# Navigate to backend directory
cd travel-scope/backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
touch .env
```

**.env content**
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Start Backend Server**
```bash
uvicorn server:app --host 0.0.0.0 --port 3001
```

**Test Endpoints**
- POST: `http://localhost:3001/api/travel-recommendations`
- POST: `http://localhost:3001/api/destination-details`
- Docs: `http://localhost:3001/docs`

---

## 🔮 Future Enhancements

- ✈️ Real transportation API integration for live fares
- 👤 User authentication and saved trips
- 🗓️ Itinerary planner with AI suggestions
- 🗸️ Google Maps embedding for dynamic navigation
- ☂️ Weather forecasts for selected destinations

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

