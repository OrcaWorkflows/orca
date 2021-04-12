import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';

import DragNDrop from './components/dnd/index';

import './index.css';
import logo from './assets/logo/vector/default-monochrome-black.svg'
import {createNodes} from "./components/dnd/nodes/nodegenerator";
const routes = [
    {
        path: '/',
        component: DragNDrop,
    }
];

// Create Custom Nodes
createNodes();

const Header = withRouter(({history, location}) => {
    return (
        <header>
            <div className={"logo-item"}>
                <img src={logo} alt={"Logo"}/>
            </div>
            <div className={"logo"}>
            </div>
        </header>
    );
});

ReactDOM.render(
    <Router forceRefresh={true}>
        <Header/>
        <Switch>
            {routes.map((route) => (
                <Route exact path={route.path} render={() => <route.component/>} key={route.path}/>
            ))}
        </Switch>
    </Router>,
    document.getElementById('root')
);