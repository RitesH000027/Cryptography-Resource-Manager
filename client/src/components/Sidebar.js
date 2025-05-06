import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FaHome />, text: 'Home' },
    { path: '/resources', icon: <FaBook />, text: 'Resources' },
    { path: '/events', icon: <FaCalendarAlt />, text: 'Events' },
    { path: '/articles', icon: <FaFileAlt />, text: 'Articles' },
  ];

  return (
    <SidebarContainer>
      <Logo>
        CryptoRM
      </Logo>
      <NavList>
        {menuItems.map(item => (
          <NavItem 
            key={item.path}
            active={location.pathname === item.path}
          >
            <NavLink to={item.path}>
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
      <LogoutButton>
        <FaSignOutAlt />
        <span>Logout</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  background: white;
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => `${theme.colors.error}10`};
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default Sidebar;