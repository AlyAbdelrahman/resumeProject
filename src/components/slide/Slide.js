import React from 'react';

const Slide = ({ text, backgroundImage, subHeader }) => (
    <div className="slideContainer" >
        <div className="slide__text">
            <div className="slide__text__container">
                <h1 className="slide__text__header">{text}</h1>
                <div className="underLines__container">
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
                <div className="slide__text__discription">
                    <p className="slide__text__details">{subHeader}</p>
                </div>
            </div>
        </div>
        {backgroundImage && <div className="slide__image">
            <img src={backgroundImage}></img>
        </div>}
    </div>
);

export default Slide;
