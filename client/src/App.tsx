import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { AppstoreOutlined, CalendarOutlined, DashboardOutlined } from '@ant-design/icons';
import AppList from './pages/AppList';

const { Header, Content, Sider } = Layout;

const AppContent: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const items = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: <Link to="/">Portfolio Apps</Link>,
    },
    {
      key: '/plans',
      icon: <CalendarOutlined />,
      label: <Link to="/plans">Plans & Roadmap</Link>,
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', lineHeight: '32px', fontWeight: 'bold' }}>
          ToolManager
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', paddingLeft: 24 }}>
          <h2 style={{ margin: 0 }}>Product Portfolio Management</h2>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 'calc(100vh - 112px)', background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Routes>
              <Route path="/" element={<AppList />} />
              <Route path="/plans" element={<div>Plans (Coming Soon)</div>} />
              <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
