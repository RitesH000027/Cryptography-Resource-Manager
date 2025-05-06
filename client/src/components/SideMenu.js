import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/authcontext';

const SideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};

  @media (max-width: 768px) {
    width: 80%;
    max-width: 300px;
  }
`;

const MenuHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  margin-bottom: 10px;
`;

const UserName = styled.h3`
  margin: 10px 0 5px;
  font-size: 18px;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const MenuItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const MenuItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MenuLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: block;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SideMenu = ({ isOpen, toggleMenu }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (toggleMenu) toggleMenu();
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <SideMenuContainer $isOpen={isOpen}>
      <MenuHeader>
        <UserInfo>
          <Avatar>{user ? getInitials(user.name) : '?'}</Avatar>
          <UserName>{user ? user.name : 'Guest'}</UserName>
          <UserEmail>{user ? user.email : ''}</UserEmail>
        </UserInfo>
      </MenuHeader>
      <MenuItems>
        <MenuItem>
          <MenuLink to="/profile" onClick={toggleMenu}>Profile</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/dashboard" onClick={toggleMenu}>Dashboard</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/resources" onClick={toggleMenu}>Resources</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/settings" onClick={toggleMenu}>Settings</MenuLink>
        </MenuItem>
        <MenuItem>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </MenuItem>
      </MenuItems>
    </SideMenuContainer>
  );
};

export default SideMenu;