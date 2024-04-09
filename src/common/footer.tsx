import * as React from 'react'; 
import { Layout } from 'antd';
import 'antd/dist/antd.css';

const { Footer } = Layout;

export const FooterSurvey: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center', background: 'white', zIndex:999 }}>Copyright © 2024 CXInSight - CXM Platform</Footer>
  );
}

export default FooterSurvey;
