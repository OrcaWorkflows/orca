import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, withRouter} from 'react-router-dom';

import DragNDrop from './components/home/dnd/index';

import './index.css';
import logo from './assets/logo/vector/default-monochrome-black.svg'
import {createNodes} from "./components/home/dnd/nodes/nodegenerator";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import Account from "./components/auth/account";
import SideHeader from "./components/navigation/sideheader";
import SideHeader2 from "./components/navigation/sideheader";
import State from "./components/data/state";
import Settings from "./components/settings";
import Workflows from "./components/workflows";
import Templates from "./components/templates";
import Schedule from "./components/schedule";

// Create Custom Nodes
createNodes();

export const SEPERATOR:string = "-";

export const getHidden = () => {
    const isLoggedIn = localStorage.getItem("user");
    return isLoggedIn != null;
}

const Header = withRouter(({history, location}) => {
    return (
        <div className={"main-header"}>
            <header>
                <div className={"logo-item"}>
                    <img src={logo} alt={"Logo"}/>
                </div>
                <Account/>
                <Logout/>
            </header>
        </div>
    );
});

const OrcaRouter = () => {
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn != null) {
        console.log(localStorage.getItem("currentPage"));
        switch (localStorage.getItem("currentPage")) {
            case "Home":
                return <DragNDrop />;
            case "Workflows":
                return <Workflows />;
            case "Templates":
                return <Templates />;
            case "Schedule":
                return <Schedule />;
            case "Settings":
                return <Settings />;
            default:
                return <DragNDrop />;
        }
    }
    return <Login />;
}

ReactDOM.render(
    <Router forceRefresh={true}>
        {getHidden() ? <Header/> : ''}
        <OrcaRouter/>
    </Router>
    ,
    document.getElementById('root')
);