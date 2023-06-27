import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/user/LoginSignup.jsx';
import {Toaster} from 'react-hot-toast';
import ProblemList from './components/problem/ProblemList.jsx';
import { useEffect } from 'react';
import store from './store';
import { loadUser } from './action/userAction.js';
import Problem from './components/problem/Problem.jsx';
import CreateProblem from './components/problem/CreateProblem';
import ProtectedRoute from './components/routes/ProtectedRoutes';
import ForgotPassword from './components/user/ForgotPassword.jsx';

function App() {

  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProblemList/>}/>
        <Route path="/admin/createProblem" element={<ProtectedRoute isAdmin={true} />}>
          <Route index element={<CreateProblem/>} />
        </Route>
        <Route path="/password/forgot" element={<ProtectedRoute isAdmin={true} />}>
          <Route index element={<ForgotPassword/>} />
        </Route>
        <Route path="/problems" element={<ProblemList/>}/>
        <Route path="/login" element={<LoginSignup/>} />
        <Route path="/problem/:id" element={<Problem/>}/>
      </Routes>
    <Toaster/>
    </Router>
  );
}

export default App;
