import React from 'react';
import './Inscription.css'
import { Redirect } from 'react-router-dom'

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

    resetForm() {
        this.setState({
            name: '',
            firstName: '',
            email: '',
            password: '',
            redirection: false,
            selectedFile: null
        });
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handleFirstNameChange(event) {
        this.setState({
            firstName: event.target.value
        });
    }

    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event) {
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
        e.preventDefault();
        
        const data = new FormData()

        if (this.state.selectedFile != null) {
            data.append('file', this.state.selectedFile)
        }

        data.append('name', this.state.name)
        data.append('firstName', this.state.firstName)
        data.append('email', this.state.email)
        data.append('password', this.state.password)

        fetch('http://localhost:5000/api/user/signup', {
            method: 'POST',
            headers: {
            },
            body: data
        }).then(async (response) => {
            if (response.status === 200) {
                this.setState({ redirection: true });
            } else {
                return Promise.reject(await response.json());
            }
        }).catch(err => {
            console.log('err', err);
            alert(err);
            this.resetForm();
        })
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/Connexion' />
        }
        return (
            <div className="Inscription">
                <h2>Veuillez renseigner les champs suivants pour vous inscrire</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="Inscription-form" >
                        <label className="Inscription-label" for="nom">Nom* : </label>
                        <input className="Inscription-input" type="text" id="nom" value={this.state.name} onChange={this.handleNameChange} placeholder="Dupont" />
                        <label className="Inscription-label" for="prenom">Prénom* : </label>
                        <input className="Inscription-input" type="text" id="prenom" value={this.state.firstName} onChange={this.handleFirstNameChange} placeholder="Alain" />
                        <label className="Inscription-label" for="email">Email* : </label>
                        <input className="Inscription-input" type="email" id="email" value={this.state.email} onChange={this.handleEmailChange} placeholder="alain.dupont@mail.com" />
                        <label className="Inscription-label" for="password">Mot de passe* : </label>
                        <input className="Inscription-input" type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Entre 4 et 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre" />
                        <label className="Inscription-label" for="avatar">Photo de profil** : </label>
                        <input className="Inscription-file" type="file" id="avatar" accept="image/png, image/jpeg" onChange={this.handleFileChange} />
                        <p className="Inscription-request">* : champs obligatoires</p>
                        <p className="Inscription-request">** : fichiers acceptés : .jpeg et .png</p>
                    </div>
                    <input className="Inscription-input Submit-form" type="submit" value="Envoyer" />
                </form>
            </div>
        );
    }
}

export default Inscription;