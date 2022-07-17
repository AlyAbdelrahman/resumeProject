import React, { useState } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import MouseParallaxbackground from 'components/svgBackground/MouseParallaxbackground';
import Header from 'containers/header/Header';
import Slide from 'components/slide/Slide';
import ReactParticles from 'react-particles-js';
import Projects from 'components/projects/Projects';
import particlesConfig from './particles-config';

import './sass/main.scss';

function App() {
  const [index, setIndex] = useState(true);
  const [isbackGroundAnimationActive, setisBackGroundAnimationActive] = useState(false);
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const afterLoad = (origin, destination) => (destination.index === 1 ? setisBackGroundAnimationActive(false) : setisBackGroundAnimationActive(true));
  const handleClickShowMore = () => {
    setShowMoreProjects(!showMoreProjects);
  };
  return (
    <>
      <MouseParallaxbackground index={index} active={isbackGroundAnimationActive} />
      <Projects showMoreProjects={showMoreProjects} />
      <Header showMoreProjects={showMoreProjects} setShowMoreProjects={setShowMoreProjects} />
      <ReactFullpage
        // fullpage options
        licenseKey="YOUR_KEY_HERE"
        style={{ postion: 'relative' }}
        className="section0"
        scrollingSpeed={2000} /* Options here */
        navigation
        fadingEffect
        navigationPosition="left"
        delay={2000}
        afterLoad={afterLoad}
        normalScrollElements=".demo"
        render={({ state, fullpageApi }) => (
            <ReactFullpage.Wrapper>
              <div className="section section0">
                <Slide text="Hi,        I'm Aly"
                subHeader="Web &       User Interface     Developer"
                setisBackGroundAnimationActive={setisBackGroundAnimationActive}
                />
                <p className="scrollDownText">scroll down</p>
              </div>
              <div className="section section1 ">
                <Slide text="About Me"
                  subHeader=" The primary area of my interest is undoubtedly front-end.
                  My passion for code had begun in my early years in collage,
                  For over a 3 years I had many opportunities to work in a vast spectrum of web technologies."
                  backgroundImage="https://i.pinimg.com/originals/8b/35/fe/8b35fef55fba1a201c9c7a11d3ec3d64.gif"
                  slideNumber="01"
                  setisBackGroundAnimationActive={setisBackGroundAnimationActive}
                  className="aboutMe-slide"
                />
              </div>
              <div className="section tech-section">
                <Slide text="What I'm Into"
                subHeader="Front End developing."
                backgroundComponent
                showMeButtonLink="www.google.com"
                slideNumber="02"
                onClickShowMore={handleClickShowMore}
                setisBackGroundAnimationActive={setisBackGroundAnimationActive}
                 />
              </div>
            </ReactFullpage.Wrapper>
        )}
      />

      <div className="sky-color"></div>
      <ReactParticles
        params={particlesConfig}
        style={{
          position: 'absolute',
          zIndex: showMoreProjects ? 9999 : -1,
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      />
    </>
  );
}

export default App;
