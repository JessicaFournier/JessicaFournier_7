import React from 'react';
import './Connexion.css'

import { Redirect } from 'react-router-dom'

class Connexion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirection: false
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event){
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit(e) {
        let objetPost = {
            email: this.state.email,
            password: this.state.password,
        }
        e.preventDefault();
        fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objetPost)
            }).then((response) => {
                return response.json();
            }).then((data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
            }).then(() => {
                this.setState({redirection: true});
            }).catch(err => {
                console.log('err', err);
                alert("Serveur non disponible");
            })
    }
    
    render(){
        const {redirection} = this.state;
        if (redirection) {
            return <Redirect to='/Profil'/>;
        }
        return(
            <form className="Connect-form" onSubmit={this.handleSubmit}>
                <label className="Inscription-label" for="email">Email : </label>
                <input className="Inscription-input" type="email" id="email" value={this.state.value} onChange={this.handleEmailChange}/>
                <label className="Inscription-label" for="pass">Mot de passe : </label>
                <input className="Inscription-input" type="password" id="pass" value={this.state.value} onChange={this.handlePasswordChange}/>
                <input className="Inscription-input Submit-form" type="submit" value="Envoyer"/>
            </form>
        );
    }
}

export default Connexion;