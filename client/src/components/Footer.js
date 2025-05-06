import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import footerLogo from '../images/footer-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">

        <FooterContent>
          <FooterLeft>
            <InstituteLogo src={footerLogo} alt="IIIT Delhi Logo" style={{  width: '200px', height: '40px', background: 'white', marginRight: '0.5rem' }}  />
          </FooterLeft>
          
          <FooterCenter>
            <FooterCopyright>
              Copyright © {currentYear} IIIT Delhi. All rights reserved.
            </FooterCopyright>
          </FooterCenter>
          
          <FooterRight>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </SocialLink>
          </FooterRight>
        </FooterContent>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #333333;
  color: white;
  padding: 0.8rem 0;
  margin-top: -70px;
  margin-bottom: 0px;
  height: 55px;
  display: flex;
  align-items: center;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
`;

const InstituteLogo = styled.img`
  height: 30px;
  width: auto;
`;

const FooterCenter = styled.div`
  text-align: center;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
`;

const FooterCopyright = styled.p`
  color: #cccccc;
  font-size: 0.85rem;
  margin: 0;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    color: #cccccc;
  }
`;

export default Footer;