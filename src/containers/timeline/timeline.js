import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Icon from 'components/icons/Icon';

const Timeline = ({ setisBackGroundAnimationActive }) => {
  const handleMouseOver = () => {
    setisBackGroundAnimationActive(false);
  };
  return (
        <VerticalTimeline className="demo" onMouseEnter={handleMouseOver}>
             <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date="2022 - present"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<Icon icon="briefcase" size={26.4} className="header__socialMedia__icon" color='white' />}
            >
                <h3 className="vertical-timeline-element-title">Vodafone international services (_Vois)</h3>
                <h4 className="vertical-timeline-element-subtitle">Maadi, Cairo</h4>
                <p>
                Working as Senior Front-end developer revamping the Vodafone ireland portal using React and maintaining the current working business portal</p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date="2019 - 2022"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<Icon icon="briefcase" size={26.4} className="header__socialMedia__icon" color='white' />}
            >
                <h3 className="vertical-timeline-element-title">Cegedim</h3>
                <h4 className="vertical-timeline-element-subtitle">Tagammo, Cairo</h4>
                <p>
                Worked as Front-end developer closely with our development and product team to develop, modify a web-based application and user interfaces across all channels
    </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2019 - 2019"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<Icon icon="briefcase" size={26.4} className="header__socialMedia__icon" color='white' />}
            >
                <h3 className="vertical-timeline-element-title">Link Development</h3>
                <h4 className="vertical-timeline-element-subtitle">Maadi, Cairo</h4>
                <p>
                  Worked As Front-End Developer closely with the design team and development teams to create elegant, usable, responsive, and interactive interfaces across multiple devices
    </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2018 - 2019"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<Icon icon="graduation-cap" size={26.4} className="header__socialMedia__icon" color='white' />}
            >
                <h3 className="vertical-timeline-element-title">Information Technology Institute</h3>
                <h4 className="vertical-timeline-element-subtitle">ITI , smart Village</h4>
                <p>
                   Got accepted in the 9 months program in the internship of "ITI" department of " web developing & User interface"
    </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2013 - 2018"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<Icon icon="bank" size={26.4} className="header__socialMedia__icon" color='white' />}
            >
                <h3 className="vertical-timeline-element-title">Modern academy for Engineering & Technonolgy</h3>
                <h4 className="vertical-timeline-element-subtitle">Maddi, Cairo</h4>
                <p>
                    Studied computer engineering combined with  the fields of electrical engineering and computer science to create new computer hardware and software
    </p>
            </VerticalTimelineElement>
        </VerticalTimeline >

  );
};
export default Timeline;
