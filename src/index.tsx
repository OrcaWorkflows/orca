import React, { ChangeEvent } from 'react';
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
    const onChange = (event: ChangeEvent<HTMLSelectElement>) => history.push(event.target.value);

    return (
        <header>
            <a className="logo" href="assets/orca.jpeg">
        ORCA
    </a>
    <select defaultValue={location.pathname} onChange={onChange}>
        {routes.map((route) => (
                <option value={route.path} key={route.path}>
            {route.path === '/' ? 'orca workflow manager' : route.path.substr(1, route.path.length)}
            </option>
))}
    </select>
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