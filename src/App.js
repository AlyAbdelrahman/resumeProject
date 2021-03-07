import React, { useState, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import MouseParallaxbackground from 'components/svgBackground/MouseParallaxbackground';
import Header from 'containers/header/Header';
import Slide from 'components/slide/Slide';

import './sass/main.scss';

function App() {
  const [index, setIndex] = useState(true);
  const [animationIsFinished, setAnimationIsFinished] = useState(false);

  let fullApi;
  let timeoutId;
  const handleOnSlideLeave = (currentIndex, nextIndex) => {
    // document.querySelector('.fp-table.active ').className += 'aos-animate';
    // setIndex(nextIndex.index);
    // console.log('>>currentIndex', currentIndex);
    // console.log('>>nextIndex', nextIndex);
  };
  const onLeave = (section, origin, destination, direction) => {
    // setTimeout(() => true, 1000);
    // ret
    const curTime = new Date().getTime();
    // animating my element
    // console.log('>>fullApi', fullApi);
    // document.getElementById('animationXmoon').className += 'addCSS';
    // setTimeout(() => fullApi.moveTo(destination.index + 1), 2000);
    // return false;
    // clearTimeout(timeoutId);

    // timeoutId = setTimeout(() => {
    //   setAnimationIsFinished(true);

    //   setIndex(section.index);
    //   fullApi.moveTo(destination.index + 1);
    // }, 2000);

    // return animationIsFinished;

    // console.log('>>section', section);
    // console.log('>>origin', origin);
    // console.log('>>destination', destination);
    // console.log('>>direction', direction);
  };
  return (
    <>
      {/* <Canvas style={{ postion: 'absolute' }}/> */}

    <Header/>
    <ReactFullpage
    // fullpage options
      licenseKey="YOUR_KEY_HERE"
      style= {{ postion: 'relative' }}
      className="section0"
      scrollingSpeed={2000} /* Options here */
      navigation
      fadingEffect
      navigationPosition="left"
      afterLoad={handleOnSlideLeave}
      delay={2000}
      onLeave={onLeave}
      render={({ state, fullpageApi }) => {
        fullApi = fullpageApi;
        return (
        <ReactFullpage.Wrapper>
          <div className="section section0">
          <Slide text="Hi,        I'm Aly" subHeader="Web & User Interface     Developer"/>
          </div>
          <div className="section section1 ">
          <Slide text="About Me" backgroundImage="https://www.capturelandscapes.com/wp-content/uploads/2019/04/Desert-Nights.jpg"/>

          </div>
          <div className="section ">
          <div className="fp-bg"></div>

          <div style={{ display: 'flex' }}>
            <p>Section 3</p>
            <div style={{ background: 'green', width: '200rem', height: '40rem' }}>

            </div>

          </div>
          </div>
        </ReactFullpage.Wrapper>
        );
      }}
      />

      <div className="sky-color"></div>
      <MouseParallaxbackground index={index}/>

      </>
  );
}

export default App;
