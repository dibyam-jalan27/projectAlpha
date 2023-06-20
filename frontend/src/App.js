import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/user/LoginSignup.jsx';
import {Toaster} from 'react-hot-toast';
import ProblemList from './components/problem/ProblemList.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProblemList/>}/>
        <Route path="/login" element={<LoginSignup/>} />
      </Routes>
    <Toaster/>
    </Router>
  );
}

export default App;
