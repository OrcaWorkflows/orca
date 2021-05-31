import * as React from 'react';
import SideHeader from "../navigation/sideheader";
import './settings.css'

export const Settings = () => {

    return (
        <div className={"settings-root"}>
            <SideHeader/>
            <div className={"settings"}>
                <h2>Settings !</h2>
            </div>
        </div>
    );
}

export default Settings;