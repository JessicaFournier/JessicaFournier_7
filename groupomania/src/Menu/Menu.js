import React, { Component } from 'react'
import './Menu.css'
import { Link, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'


class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirection: false
        }

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick() {
        localStorage.clear();
        this.setState({redirection: true});
    }

    render() {
        const {redirection} = this.state;
        if (redirection) {
            return <Redirect to='/'/>;
        }
        return (
            <div className="Page-bloc">
                <div className="Menu-bloc">
                    <p className="Menu-title">Menu</p>
                    <div className="Menu-iconLink">
                        <FontAwesomeIcon className=""  icon={faComments} />
                        <Link className="Menu-link" to="/Discussion">Salon de discussion</Link>
                    </div>
                    <div className="Menu-iconLink">
                        <FontAwesomeIcon className=""  icon={faUser} />
                        <Link className="Menu-link" to="/Profil/">Mon profil</Link>
                    </div>
                    
                    <div className="Menu-logout" onClick={this.handleLogoutClick} >Deconnexion</div>
                </div>
            </div>
        );
    }
}

export default Menu;