import React from 'react';
import { Layout as AntLayout } from 'antd';
import { useTheme } from './ThemeProvider';
import HomeNavbar from './HomeNavbar';
import AIChatbot from './AIChatbot';
import Footer from './Footer';
import './PublicLayout.css';

const { Content } = AntLayout;

interface PublicLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showChatbot?: boolean;
  showFooter?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showChatbot = true,
  showFooter = true
}) => {
  const { isDark } = useTheme();

  return (
    <AntLayout className={`public-layout ${isDark ? 'dark' : 'light'}`}>
      {showNavbar && <HomeNavbar />}
      <Content className="public-content">
        <div className="content-wrapper">
          {children}
        </div>
      </Content>
      {showFooter && <Footer />}
      {showChatbot && <AIChatbot />}
    </AntLayout>
  );
};

export default PublicLayout;