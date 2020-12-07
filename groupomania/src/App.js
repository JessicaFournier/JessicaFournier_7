import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom'
import { Link } from 'react-router-dom'
import logo from './logoGroupomania.png';
import './App.css';
import Home from './Home/Home.js'
import Inscription from './Inscription/Inscription.js'
import Connexion from './Connexion/Connexion.js'
import Profil from './Profil/Profil.js'
import Discussion from './Discussion/Discussion.js'
import Message from './Message/Message.js'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to={'/'}><img src={logo} className="App-logo" alt="logo" /></Link>
          <Link to={'/'} className="App-accueil">Accueil</Link>
        </header>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/Inscription' component={ Inscription } />
          <Route path='/Connexion' component={ Connexion } />
          <Route path='/Profil' component={ Profil } />
          <Route exact path='/Discussion' component={ Discussion } />
          <Route path='/Discussion/:id'  component={Message} />
          <Route path='/Message' component={Message} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
