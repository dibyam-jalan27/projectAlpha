import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/user/LoginSignup.jsx';
import {Toaster} from 'react-hot-toast';
import { useEffect } from 'react';
import store from './store';
import { loadUser } from './action/userAction.js';
import Problem from './components/problem/Problem.jsx';
import ProtectedRoute from './components/routes/ProtectedRoutes';
import ForgotPassword from './components/user/ForgotPassword.jsx';
import AddProblem from './components/problem/AddProblem';
import ProblemSet from './components/problem/ProblemSet';
import NoContent from './components/layout/NoContent/NoContent';
import NavBar from './components/layout/NavBar/NavBar';
import UserSubmissions from './components/user/userSubmissions';
import Dashboard from './components/DashBoard/Dashboard';
import ResetPassword from './components/user/resetPassword';

function App() {

  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
        <Route path="/" element={<ProblemSet/>}/>
        <Route path="/admin/createProblem" element={<ProtectedRoute isAdmin={true} />}>
          <Route index element={<AddProblem/>} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute/>}>
          <Route index element={<Dashboard/>} />
        </Route>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/submissions" element={<ProtectedRoute/>}>
          <Route index element={<UserSubmissions/>} />
        </Route>
        <Route path="/problems" element={<ProblemSet/>}/>
        <Route path="/login" element={<LoginSignup/>} />
        <Route path="/problem/:id" element={<Problem/>}/>
        <Route path="*" element={<NoContent/>}/>
      </Routes>
    <Toaster/>
    </Router>
  );
}

export default App;
