import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { ReactComponent as Circles } from 'components/svgBackground/Circles.svg';
import { ReactComponent as Stars } from './Stars.svg';
import { ReactComponent as Moon } from '../icons/assets/moon.svg';
import { ReactComponent as Cloud1 } from './Cloud1.svg';
import { ReactComponent as Cloud12 } from './Cloud12.svg';
import { ReactComponent as LightCloud } from './LightCloud.svg';

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans1 = (x, y) => `translate3d(${x * 2 / 25 - 70}px,${y / 50}px,0)`;
const trans2 = (x, y) => `translate3d(${x / 40 - 50}px,${y / 20 - 130}px,0)`;
const trans3 = (x, y) => `translate3d(${x / 6 - 250}px,${y / 6 - 200}px,0)`;
const trans4 = (x, y) => `translate3d(${x / 3.5}px,${y / 3.5}px,0)`;

const MouseParallaxbackground = ({ index }) => {
  const [props, setCiecles] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }));
  useEffect(() => {
    console.log(index);
  }, [index]);

  return (
  <div className="container " onMouseMove={({ clientX: x, clientY: y }) => setCiecles({ xy: calc(x, y) })}>
   <animated.div className="card1" style={{ transform: props.xy.interpolate(trans1) }} >
        <Circles />
   </animated.div>
   <animated.div className="card2" style={{ transform: props.xy.interpolate(trans2) }} >
        <Stars />
   </animated.div>
    <animated.div className="card3" id="animated__moon" style={{ transform: props.xy.interpolate(trans1) }} >
      <Moon/>
   </animated.div>
   <animated.div className="card4 cloud1" id="cloud1" style={{ transform: props.xy.interpolate(trans1) }} >
      <Cloud1/>
   </animated.div>
   <animated.div className="card5 cloud2" id="cloud2" style={{ transform: props.xy.interpolate(trans1) }} >
      <Cloud12/>
   </animated.div>
   <animated.div className="card6 cloud3" id="cloud3" style={{ transform: props.xy.interpolate(trans1) }} >
      <LightCloud/>
   </animated.div>
  </div>

  );
};
export default MouseParallaxbackground;
