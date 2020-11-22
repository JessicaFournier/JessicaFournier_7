import React, { Component } from 'react'
import './Profil.css'
import photoprofil from './bonhomme.png'

class Profil extends Component {
  render() {
    return (
        <div>
            <h2>Mon profil</h2>
            <div className="Profil-bloc">
                <div>
                    <img src={photoprofil} className="Photo-profil" alt="profil"/>
                    <div>
                        <input className="Profil-modif" type="file" accept="image/png, image/jpeg"/>
                    </div>
                </div>
                <div>
                    <p className="Profil-p">Nom : </p>
                    <p className="Profil-p">Prénom : </p>
                </div>
            </div>
            
        </div>
    );
  }
}

export default Profil;