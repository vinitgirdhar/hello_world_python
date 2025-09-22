import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { useTheme } from './ThemeProvider';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  type?: 'dashboard' | 'public';
}

const Layout: React.FC<LayoutProps> = ({ children, type = 'dashboard' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Public layout (for pages like Map, Gallery, News that don't need full dashboard)
  if (type === 'public') {
    return (
      <AntLayout className={`app-layout public-layout ${isDark ? 'dark' : 'light'}`}>
        <Content className="public-content">
          {children}
        </Content>
        <Footer />
      </AntLayout>
    );
  }

  // Dashboard layout (for authenticated pages with sidebar)
  return (
    <AntLayout className={`app-layout dashboard-layout ${isDark ? 'dark' : 'light'}`}>
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapse} />
      <AntLayout className={`main-layout ${collapsed ? 'collapsed' : ''}`}>
        <Header collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        <Content className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </Content>
        <Footer />
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;