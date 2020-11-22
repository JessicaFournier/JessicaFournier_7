import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom'
import { Link } from 'react-router-dom'
import logo from './icon-left-font-monochrome-white.png';
import './App.css';
import Home from './Home/Home.js'
import Inscription from './Inscription/Inscription.js'
import Connexion from './Connexion/Connexion.js'
import Profil from './Profil/Profil.js'
import Discussion from './Discussion/Discussion.js'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to={'/'}><img src={logo} className="App-logo" alt="logo" /></Link>
        </header>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/Inscription' component={ Inscription } />
          <Route path='/Connexion' component={ Connexion } />
          <Route path='/Profil' component={ Profil } />
          <Route path='/Discussion' component={ Discussion } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
