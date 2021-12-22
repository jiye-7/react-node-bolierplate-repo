import React from 'react';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './hoc/auth';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        {/** react-router-dom@6 */}
        <Routes>
          <Route path='/' element={Auth(LandingPage, null)} />
          <Route path='/login' element={Auth(LoginPage, false)} />
          <Route path='/register' element={Auth(RegisterPage, false)} />
        </Routes>
        {/** react-router-dom@5 */}
        {/* <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </Switch> */}
      </div>
    </Router>
  );
}

export default App;
