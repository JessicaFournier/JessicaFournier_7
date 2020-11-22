import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './Home.css'

class Home extends Component {
  render() {
    return (
        <div>
            <h1>Bienvenue sur le réseau social de Groupomania</h1>
            <Link className='Home-button' to={'/Inscription'}>Je m'inscris</Link>
            <Link className='Home-button' to={'/Connexion'}>Je me connecte</Link>
        </div>
    );
  }
}

export default Home;