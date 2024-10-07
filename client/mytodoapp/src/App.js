import './App.css'
import {Route} from 'react-router'
import { Switch, BrowserRouter } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
