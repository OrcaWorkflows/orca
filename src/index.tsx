import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';


import DragNDrop from './components/dnd/index';


import './index.css';

const routes = [
    {
        path: '/',
        component: DragNDrop,
    }
];

const Header = withRouter(({ history, location }) => {
    return (
    <header>
        <a className="logo">
            ORCA Workflow Manager
        </a>
    </header>
);
});

ReactDOM.render(
    <Router forceRefresh={true}>
        <Header />
        <Switch>
            {routes.map((route) => (
                    <Route exact path={route.path} render={() => <route.component />} key={route.path} />
))}
</Switch>
</Router>,
document.getElementById('root')
);