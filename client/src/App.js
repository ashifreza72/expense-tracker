import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Logregister from './pages/Logregister';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Logregister />} />{' '}
        {/* This is your login/register page */}
        <Route path='/dashboard' element={<Dashboard />} />{' '}
        {/* Redirect after login */}
      </Routes>
    </Router>
  );
}

export default App;
