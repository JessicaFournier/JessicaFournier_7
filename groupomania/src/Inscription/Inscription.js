import React from 'react';
import './Inscription.css'
import { Link } from 'react-router-dom'

class Inscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            showForm: null,
        };

        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="Inscription-form" >
                    <label className="Inscription-label" for="nom">Nom : </label>
                    <input className="Inscription-input" type="text" id="nom" name="nom" value={this.state.value}/>
                    <label className="Inscription-label" for="prenom">Prénom : </label>
                    <input className="Inscription-input" type="text" id="prenom" name="prenom" value={this.state.value}/>
                    <label className="Inscription-label" for="email">Email : </label>
                    <input className="Inscription-input" type="email" id="email" value={this.state.value}/>
                    <label className="Inscription-label" for="avatar">Photo de profil : </label>
                    <input className="Inscription-file" type="file" id="avatar" accept="image/png, image/jpeg" value={this.state.value}/>
                </div>
                <Link to={'/Profil'}><input className="Inscription-input Submit-form" type="submit" value="Envoyer"/></Link>
            </form>
        );
    }
}

export default Inscription;