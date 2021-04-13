import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, withRouter} from 'react-router-dom';

import DragNDrop from './components/dnd/index';

import './index.css';
import logo from './assets/logo/vector/default-monochrome-black.svg'
import {createNodes} from "./components/dnd/nodes/nodegenerator";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import Account from "./components/auth/account";

// Create Custom Nodes
createNodes();

export const getHidden = () => {
    const isLoggedIn = localStorage.getItem("user");
    return isLoggedIn != null;
}

const Header = withRouter(({history, location}) => {
    return (
        <header>
            <div className={"logo-item"}>
                <img src={logo} alt={"Logo"}/>
            </div>
            <Account/>
            <Logout/>
        </header>
    );
});

const OrcaRouter = () => {
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn != null) {
        return <DragNDrop />;
    }
    return <Login />;
}

ReactDOM.render(
    <Router forceRefresh={true}>
        {getHidden() ? <Header/> : ''}
        <OrcaRouter/>
    </Router>,
    document.getElementById('root')
);