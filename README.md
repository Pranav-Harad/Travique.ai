<div align="center">
  
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Travique.ai&fontSize=70&fontAlignY=38&animation=twinkling&fontColor=ffffff" />

  **An intelligent, seamless, and dynamic AI-powered travel itinerary generator.**  
  *Explore the world, tailored specifically for you.*

  <p align="center">
    <a href="https://github.com/Pranav-Harad/Travique.ai/stargazers"><img src="https://img.shields.io/github/stars/Pranav-Harad/Travique.ai?color=yellow&style=for-the-badge" alt="Stars" /></a>
    <a href="https://github.com/Pranav-Harad/Travique.ai/network/members"><img src="https://img.shields.io/github/forks/Pranav-Harad/Travique.ai?color=orange&style=for-the-badge" alt="Forks" /></a>
    <a href="https://github.com/Pranav-Harad/Travique.ai/issues"><img src="https://img.shields.io/github/issues/Pranav-Harad/Travique.ai?color=red&style=for-the-badge" alt="Issues" /></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  </p>

</div>

---

## ✨ Features

- 🤖 **AI-Powered Itineraries:** Instantly generates comprehensive, day-by-day travel plans using **Google Gemini**.
- 🎨 **Premium UI/UX:** Built with a stunning, glassmorphic design utilizing **Tailwind CSS** and smooth **Framer Motion** animations.
- 🔐 **Secure Authentication:** Seamless user login and management powered by **Clerk**.
- 🗂️ **Trip Management:** Save, revisit, and manage all your past and upcoming generated trips.
- ⚡ **Lightning Fast:** Fast frontend powered by **Vite** & **React**, backed by an efficient **Node.js/Express** server.

---

## 🛠️ Tech Stack

<div align="center">
  <br />
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,express,nodejs,mongodb,gemini,git" alt="Tech Stack MERN" />
  <br /><br />
</div>

### 🎨 Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

### ⚙️ Backend & Database
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### 🧠 AI & Auth
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing.

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Clerk API Keys
- Google Gemini API Key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Pranav-Harad/Travique.ai.git
cd Travique.ai
```

**2. Setup Backend Server**
```bash
cd server
npm install

# Create a .env file based on .env.example
# Add MONGO_URI, GEMINI_API_KEY, CLERK_SECRET_KEY
npm run dev
```

**3. Setup Frontend Client**
```bash
cd ../client
npm install

# Create a .env file 
# Add VITE_CLERK_PUBLISHABLE_KEY
npm run dev
```

**4. Explore**  
Visit `http://localhost:5173` to dive into the application! 🌍✈️

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to check [issues page](https://github.com/Pranav-Harad/Travique.ai/issues).

<div align="center">
  <br/>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" />
</div>
