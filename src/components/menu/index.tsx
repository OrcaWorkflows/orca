import {HamburgerArrow} from 'react-animated-burgers'
import React, {useCallback, useState} from "react";

const OrcaMenu = () => {
    const [isActive, setIsActive] = useState(false)

    const toggleButton = useCallback(
        () => setIsActive(prevState => !prevState),
        [],
    )

    return (
        <HamburgerArrow
            buttonColor="#FFBC67"
            barColor="white"
            {...{ isActive, toggleButton }}
        />
    )
};
export default OrcaMenu;