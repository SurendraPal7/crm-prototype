import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cockpit from './pages/Cockpit';
import SellerDetail from './pages/SellerDetail';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/cockpit" replace />} />
          <Route path="/cockpit" element={<Cockpit />} />
          <Route path="/seller/:sellerId" element={<SellerDetail />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;