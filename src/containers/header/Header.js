import React from 'react';
import Icon from 'components/icons/Icon';

const Header = () => (
        <header className="header">
            <h3 className="header__title">Aly Abdelrahman</h3>
            <div className="header__socialMedia">
            <Icon icon="linkedin" size={26.4} className="header__socialMedia__icon" color='white'/>
            <Icon icon="facebook2" size={26.4} className="header__socialMedia__icon" color='white'/>
            <Icon icon="instagram" size={26.4} className="header__socialMedia__icon" color='white'/>
            <Icon icon="menu" size={26.4} color='white' />

            </div>
        </header>
);
export default Header;
