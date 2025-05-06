import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardContainer>
      <DashboardSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <MainContent
        initial={false}
        animate={{
          marginLeft: sidebarOpen ? '300px' : '80px',
          width: sidebarOpen ? 'calc(100% - 300px)' : 'calc(100% - 80px)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header>
          <MenuButton onClick={toggleSidebar}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MenuButton>
          <h2>Admin Dashboard</h2>
        </Header>
        
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled(motion.div)`
  flex: 1;
  margin-left: ${({ isOpen }) => (isOpen ? '300px' : '80px')};
  transition: all 0.3s;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
  
  h2 {
    margin-left: 16px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #3f51b5;
  }
`;

const ContentWrapper = styled.main`
  padding: 24px;
  height: calc(100vh - 64px);
  overflow-y: auto;
`;

export default DashboardLayout;
