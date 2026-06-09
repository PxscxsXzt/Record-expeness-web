import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Navigation from './components/Navigation';
import DailyEntry from './pages/DailyEntry';
import WeeklySummary from './pages/WeeklySummary';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <Router>
        <div className="app-layout">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DailyEntry />} />
              <Route path="/summary" element={<WeeklySummary />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
