import React from 'react';
import Icon from 'components/icons/Icon';

const Header = ({ showMoreProjects, setShowMoreProjects }) => (
        <header className="header">
                <div className="blackLoadingScreen"></div>
                <h3 className="header__title">Aly Abdelrahman</h3>
                <div className="header__socialMedia">
                        <a href="https://www.linkedin.com/in/aly-abdelrahman-72b8a7147/" rel="noreferrer" target="_blank"><Icon icon="linkedin" size={26.4} className="header__socialMedia__icon" color='white' /></a>
                        <a href="https://alyabdelrahman.netlify.app/" rel="noreferrer" target="_blank"><Icon icon="cv" size={26.4} className="header__socialMedia__icon" color='white' /></a>
                        <a href="https://stackoverflow.com/users/13029579/aly-abd-el-rahman" rel="noreferrer" target="_blank"><Icon icon="stackoverflow" size={26.4} className="header__socialMedia__icon" color='white' /></a>
                        <a href="https://github.com/AlyAbdelrahman" rel="noreferrer" target="_blank"><Icon icon="github" size={26.4} className="header__socialMedia__icon" color='white' /></a>
                        {showMoreProjects && <Icon icon="cross" size={26.4} color='white' onClick={() => setShowMoreProjects(false)} />}

                </div>
        </header>
);
export default Header;
