import React, { useEffect } from 'react';
import $ from 'jquery';
import reactLogo from './reactLogo.png';
import html5 from './html5.png';
import css from './css.png';
import Js from './JS.png';
import sass from './sass.png';
import jqueryLogo from './jqueryLogo.png';
import bootstrapLogo from './bootstrapLogo.png';
import Ts from './Ts.png';
import nodeLogo from './node.png';
import reduxLogo from './redux.png';
import git from './git.png';
import figma from './figma.png';
import gulp from './gulp.png';
import npm from './npm.png';
import xd from './xd.png';
import matrialui from './matrialui.png';

const Sphere = () => {
  useEffect(() => {
    eval(
      `try {
             TagCanvas.Start(
               'myCanvas',
               '',
               {textColour: 'white',outlineColour: '#0000', initial:[0.530, 0.690],maxSpeed:.01,imageScale:.1}
             );
           }
           catch(e) {
             document.getElementById('myCanvasContainer').style.display = 'none';
           }`,
    );
  }, []);
  return (
    <div className="SphereContainer" >
      <div id="myCanvasContainer">
        <canvas width="500" height="500" id="myCanvas">
          <ul>
            <li><a><img src={reactLogo}></img></a></li>
            <li><a><img src={html5}></img></a></li>
            <li><a><img src={css}></img></a></li>
            <li><a><img src={Js}></img></a></li>
            <li><a><img src={sass}></img></a></li>
            <li><a><img src={jqueryLogo}></img></a></li>
            <li><a><img src={bootstrapLogo}></img></a></li>
            <li><a><img src={Ts}></img></a></li>
            <li><a><img src={nodeLogo}></img></a></li>
            <li><a><img src={reduxLogo}></img></a></li>
            <li><a><img src={git}></img></a></li>
            <li><a><img src={figma}></img></a></li>
            <li><a><img src={gulp}></img></a></li>
            <li><a><img src={npm}></img></a></li>
            <li><a><img src={xd}></img></a></li>
            <li><a><img src={matrialui}></img></a></li>
          </ul>
        </canvas>
      </div>
    </div>

  );
};
export default Sphere;
