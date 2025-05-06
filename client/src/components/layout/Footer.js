import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <FooterLogo to="/">
              <img src="/logo.png" alt="Cryptography Resource Manager" />
              <span>CryptoRM</span>
            </FooterLogo>
            <FooterText>
              A comprehensive platform for cryptography resources, articles, events, projects, and lectures.
            </FooterText>
            <SocialIcons>
              <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </SocialIcon>
              <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </SocialIcon>
            </SocialIcons>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
              <FooterLink to="/articles">Articles</FooterLink>
              
              <FooterLink to="/projects">Projects</FooterLink>
              <FooterLink to="/lectures">Lectures</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinks>
              <FooterLink to="/resources?type=video">Videos</FooterLink>
              <FooterLink to="/resources?type=note">Notes</FooterLink>
              <FooterLink to="/resources?type=book">Reference Books</FooterLink>
              <FooterLink to="/resources?type=citation">Citations</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Contact Us</FooterTitle>
            <ContactItem>
              <FaEnvelope />
              <span>contact@cryptorm.com</span>
            </ContactItem>
            <ContactForm>
              <ContactInput type="email" placeholder="Your email" />
              <ContactButton>Subscribe</ContactButton>
            </ContactForm>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <Copyright>
            &copy; {currentYear} Cryptography Resource Manager. All rights reserved.
          </Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/privacy">Privacy Policy</FooterBottomLink>
            <FooterBottomLink to="/terms">Terms of Service</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.white};
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div``;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1rem;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const FooterText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SocialIcons = styled.div`
  display: flex;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled(Link)`
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(5px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const ContactForm = styled.form`
  display: flex;
  margin-top: 1.5rem;
`;

const ContactInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px 0 0 5px;
  outline: none;
`;

const ContactButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1rem;
  }
`;

const FooterBottomLinks = styled.div`
  display: flex;
`;

const FooterBottomLink = styled(Link)`
  margin-left: 1.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 0.75rem;
  }
`;

export default Footer;