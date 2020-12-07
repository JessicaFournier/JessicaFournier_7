import React from 'react';
import './Inscription.css'
import { Link, Redirect } from 'react-router-dom'

class Inscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            firstName: '',
            email: '',
            password: '',
            redirection: false,
            selectedFile: null
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }
  
    handleFirstNameChange(event){
        this.setState({
            firstName: event.target.value
        }, () => {
            console.log(this.state)
        });
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
    handleFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    handleSubmit(e) {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        data.append('name', this.state.name)
        data.append('firstName', this.state.firstName)
        data.append('email', this.state.email)
        data.append('password', this.state.password)
        
        e.preventDefault();
        fetch('http://localhost:5000/api/user/signup', {
                method: 'POST',
                headers: {
                },
                body: data
            }).then((response) => {
                return response.json();
            }).then(() => {
                this.setState({ redirection: true })
            }).catch(err => {
                console.log('err', err);
                alert("Serveur non disponible");
            })
    }
  

    render(){
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/Connexion'/>
        }
        return(
            <div className="Inscription">
                <h2>Veuillez renseigner les champs suivants pour vous inscrire</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="Inscription-form" >
                        <label className="Inscription-label" for="nom">Nom : </label>
                        <input className="Inscription-input" type="text" id="nom" value={this.state.name} onChange={this.handleNameChange}/>
                        <label className="Inscription-label" for="prenom">Prénom : </label>
                        <input className="Inscription-input" type="text" id="prenom" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                        <label className="Inscription-label" for="email">Email : </label>
                        <input className="Inscription-input" type="email" id="email" value={this.state.email} onChange={this.handleEmailChange}/>
                        <label className="Inscription-label" for="password">Mot de passe : </label>
                        <input className="Inscription-input" type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                        <label className="Inscription-label" for="avatar">Photo de profil : </label>
                        <input className="Inscription-file" type="file" id="avatar" accept="image/png, image/jpeg"  onChange={this.handleFileChange}/>
                    </div>
                <input className="Inscription-input Submit-form" type="submit" value="Envoyer"/>
                </form>
            </div>
            
        );
    }
}

export default Inscription;