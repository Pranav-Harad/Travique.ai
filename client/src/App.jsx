import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route - No global Navbar */}
        <Route path="/" element={<Landing />} />

        {/* Other Routes wrapped with global Navbar */}
        <Route path="/login/*" element={<div className="flex flex-col min-h-screen bg-black"><Navbar /><main className="flex-grow"><Login /></main></div>} />
        <Route path="/signup/*" element={<div className="flex flex-col min-h-screen bg-black"><Navbar /><main className="flex-grow"><Signup /></main></div>} />

        <Route
          path="/dashboard"
          element={
            <div className="flex flex-col min-h-screen bg-black">
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </main>
            </div>
          }
        />
        <Route
          path="/create-trip"
          element={
            <div className="flex flex-col min-h-screen bg-black">
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              </main>
            </div>
          }
        />
        <Route
          path="/my-trips"
          element={
            <div className="flex flex-col min-h-screen bg-black">
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
