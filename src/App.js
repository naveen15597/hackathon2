import './App.css';
import {BrowserRouter as Router,Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard'
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <>
    <Router>
      <Header/>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}></Route>          
          <Route path='/SignUp' element={<Register/>}></Route>
          <Route path='/' element={<Login/>}></Route>          

        </Routes>
    </Router>
    </>
  );
}

export default App;
