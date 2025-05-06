import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/authcontext';
import SideMenu from './SideMenu';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  box-shadow: ${props => props.$scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;
  z-index: 1000;
  padding: ${props => props.$scrolled ? '0.5rem 0' : '1rem 0'};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};

  &:hover {
    color: #6c5ce7;
  }
`;

const ProfileButton = styled.button`
  margin-left: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #6c5ce7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 8px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      <HeaderContainer $scrolled={scrolled}>
        <NavContainer>
          <Logo to="/">CryptoRM</Logo>
          <Nav>
            <NavLink to="/" $active={window.location.pathname === '/'}>Home</NavLink>
            <NavLink to="/resources" $active={window.location.pathname === '/resources'}>Resources</NavLink>
            <NavLink to="/about" $active={window.location.pathname === '/about'}>About</NavLink>
            
            {user ? (
              <ProfileButton onClick={toggleMenu}>
                <Avatar>{getInitials(user.name)}</Avatar>
                {user.name}
              </ProfileButton>
            ) : (
              <>
                <NavLink to="/login" $active={window.location.pathname === '/login'}>Login</NavLink>
                <NavLink to="/register" $active={window.location.pathname === '/register'}>Register</NavLink>
              </>
            )}
          </Nav>
        </NavContainer>
      </HeaderContainer>
      
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
      <Overlay $isOpen={menuOpen} onClick={toggleMenu} />
    </>
  );
};

export default Header;