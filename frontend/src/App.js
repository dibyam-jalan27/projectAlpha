import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/user/LoginSignup.jsx';
import {Toaster} from 'react-hot-toast';
import ProblemList from './components/problem/ProblemList.jsx';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import store from './store';
import { loadUser } from './action/userAction.js';
import Problem from './components/problem/Problem.jsx';

function App() {
  const {isAuthenticated, user} = useSelector(state => state.user);

  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/problems" element={<ProblemList/>}/>
        <Route path="/login" element={<LoginSignup/>} />
        <Route path="/problem/:id" element={<Problem/>}/>
      </Routes>
    <Toaster/>
    </Router>
  );
}

export default App;
