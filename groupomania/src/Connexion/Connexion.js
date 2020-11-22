import React from 'react';
import './Connexion.css'

import { Link } from 'react-router-dom'

class Connexion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };

        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    render(){
        return(
            <form className="Connect-form" onSubmit={this.handleSubmit}>
                <label className="Inscription-label" for="email">Email : </label>
                <input className="Inscription-input" type="email" id="email" value={this.state.value}/>
                <label className="Inscription-label" for="pass">Mot de passe : </label>
                <input className="Inscription-input" type="password" id="pass" value={this.state.value}/>
                <Link to={'/Discussion'}><input className="Inscription-input Submit-form" type="submit" value="Envoyer"/></Link>
            </form>
        );
    }
}

export default Connexion;