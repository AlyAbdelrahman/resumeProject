import React from 'react';
import Coverflow from 'react-coverflow';
import useMediaQuery from 'react-use-media-query-hook';

import Invest from './InvestInEgypt.png';
import vodafoneIE from './vodafoneIE.png';

const Projects = ({ showMoreProjects }) => {
  const isTablet = useMediaQuery('(max-width: 768px)');
  return (<div className={`showMoreProject ${showMoreProjects && 'displayShowMoreProject'}`}>
    <h1 className="projectsTitle">Projects</h1>
    <Coverflow
      width={1500}
      height={800}
      displayQuantityOfSide={2}

      navigation = {!isTablet}
      infiniteScroll
      enableHeading
      media={{
        '@media (max-width: 900px)': {
          width: '600px',
          height: '300px',
        },
        '@media (min-width: 900px)': {
          width: '100%',
          height: '600px',
        },
      }}
    >
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/66311e120445161.60b185ca0a6f2.png' alt='Culture gate way' data-action="https://www.behance.net/gallery/120445161/Egyptian-Culture-gateway" />
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/1400/faa4b5120445355.60b1879272c1d.png' alt='Monshaat' data-action="http://monshaat.gov.sa/" />
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1f9545120444953.60b1843699e73.png' alt='Medical Mangment System' data-action="https://suite.maiia.com/solution/gestion" />
      <img src={Invest} alt='Invest-in-Egypt' data-action="https://www.investinegypt.gov.eg/english/Pages/default.aspx" />
      <img src={vodafoneIE} alt='Vodafone Ireland' data-action="https://n.vodafone.ie/en.html" />
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3a035574183509.5c254d309dad4.png' alt='Hotel Mangment System' data-action="https://www.behance.net/gallery/74183509/Sass-template-just-Html-css3-for-Hotels" />
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/721a3975048217.5c41a3addb060.png' alt='Company Page' data-action="https://www.behance.net/gallery/75048217/Company-Responsive-Template-With-Sass-Bootstrap4" />
      <img src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cdb8b474183761.5c254fd9a70bb.jpg' alt='Travel Agence' data-action="https://www.behance.net/gallery/74183761/Traveling-Photoshop-Template-website" />

    </Coverflow>
  </div>
  );
};
export default Projects;
