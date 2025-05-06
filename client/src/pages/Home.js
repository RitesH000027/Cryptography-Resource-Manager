import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// Remove or use the motion import if you're using framer-motion
// import { motion } from 'framer-motion';

const Home = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  
  const cryptoWords = useMemo(() => [
    'Encryption',
    'Decryption',
    'Hashing',
    'Blockchain',
    'Cryptanalysis',
    'Authentication',
    'Digital Signatures',
    'Key Exchange',
    'Symmetric Keys',
    'Asymmetric Keys',
    'RSA',
    'Advanced Encryption Standard (AES)',
    'Diffie-Hellman Key Exchange',
    'Data Encryption Standard (DES)',
    'Message Digest (MD5)',
    'SHA-256'
  ], []);
  
  const colors = useMemo(() => [
    '#4285F4', // Google Blue
    '#EA4335', // Google Red
    '#FBBC05', // Google Yellow
    '#34A853', // Google Green
    '#7B1FA2', // Purple
    '#0097A7', // Teal
    '#FF5722', // Deep Orange
  ], []);
  
  useEffect(() => {
    const wordInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * cryptoWords.length);
      setCurrentWord(cryptoWords[randomIndex]);
      
      const randomColorIndex = Math.floor(Math.random() * colors.length);
      setCurrentColor(colors[randomColorIndex]);
    }, 3000);
    
    // Set initial values
    setCurrentWord(cryptoWords[0]);
    setCurrentColor(colors[0]);
    
    return () => clearInterval(wordInterval);
  }, [cryptoWords, colors]);
  
  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroContent>
            <HeroTitle>Cryptography Resource Manager</HeroTitle>
            <AnimatedText color={currentColor}>{currentWord}</AnimatedText>
            <CryptologyInfo>
            Cryptology is the scientific study of codes, ciphers, and their applications in securing information. It encompasses both cryptography (the creation of secure systems) and cryptanalysis (the breaking of those systems). Modern cryptology includes symmetric encryption (AES, DES), asymmetric encryption (RSA, ECC), hash functions (SHA, MD5), digital signatures, and key exchange protocols. These technologies form the backbone of today's digital security infrastructure, protecting everything from personal communications to financial transactions and national security systems.
            </CryptologyInfo>
            <HeroText>
              Our platform provides cryptography enthusiasts, researchers, and students with curated resources, articles, events, and projects in one centralized location.
            </HeroText>
            <ButtonContainer>
              <PrimaryButton to="/resources">
                Explore Resources
              </PrimaryButton>
            </ButtonContainer>
          </HeroContent>
        </div>
      </HeroSection>
      
      <FeaturesSection>
        <div className="container">
          <SectionTitle>What We Offer</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureTitle>Learning Resources</FeatureTitle>
              <FeatureDescription>
                Access a wide range of cryptography learning materials including videos, PDFs, reference books, and citations.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📝</FeatureIcon>
              <FeatureTitle>Research Articles</FeatureTitle>
              <FeatureDescription>
                Read and contribute to articles on the latest cryptographic techniques, algorithms, and security practices.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🎓</FeatureIcon>
              <FeatureTitle>Academic Projects</FeatureTitle>
              <FeatureDescription>
                Explore student projects including IP, MIP, BTP, IS, and Capstone projects related to cryptography.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📅</FeatureIcon>
              <FeatureTitle>Events & Workshops</FeatureTitle>
              <FeatureDescription>
                Stay updated with upcoming cryptography events, conferences, workshops, and hackathons.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>
      
      <PopularResourcesSection>
        <div className="container">
          <SectionTitle>Popular Resources</SectionTitle>
          <ResourcesGrid>
            <ResourceCard>
              <ResourceImage src="https://placehold.co/400x180/2A4C7D/FFFFFF/png?text=RSA+Algorithm" alt="RSA Algorithm" />
              <ResourceTitle>RSA Algorithm Explained</ResourceTitle>
              <ResourceCategory>Asymmetric Encryption</ResourceCategory>
              <ResourceLink to="/resources/videos/rsa-algorithm">View Resource</ResourceLink>
            </ResourceCard>
            
            <ResourceCard>
              <ResourceImage src="https://placehold.co/400x180/1A936F/FFFFFF/png?text=AES+Encryption" alt="AES Encryption" />
              <ResourceTitle>AES Encryption Deep Dive</ResourceTitle>
              <ResourceCategory>Symmetric Encryption</ResourceCategory>
              <ResourceLink to="/resources/videos/aes-encryption">View Resource</ResourceLink>
            </ResourceCard>
            
            <ResourceCard>
              <ResourceImage src="https://placehold.co/400x180/88498F/FFFFFF/png?text=Blockchain" alt="Blockchain Cryptography" />
              <ResourceTitle>Blockchain Cryptography Basics</ResourceTitle>
              <ResourceCategory>Blockchain</ResourceCategory>
              <ResourceLink to="/resources/notes/blockchain-crypto">View Resource</ResourceLink>
            </ResourceCard>
          </ResourcesGrid>
          <MoreResourcesLink to="/resources">View All Resources</MoreResourcesLink>
        </div>
      </PopularResourcesSection>
      
      <CryptoFieldsSection>
        <div className="container">
          <SectionTitle>Understanding Cryptography</SectionTitle>
          <CryptoFieldsGrid>
            <CryptoFieldCard>
              <CryptoFieldIcon>🔐</CryptoFieldIcon>
              <CryptoFieldTitle>Cryptography</CryptoFieldTitle>
              <CryptoFieldDescription>
                The science of securing communication through encryption techniques that transform information into formats that are unreadable without the proper decryption keys.
              </CryptoFieldDescription>
              <CryptoFieldBenefits>
                <BenefitsTitle>Benefits:</BenefitsTitle>
                <BenefitsList>
                  <BenefitItem>Ensures data confidentiality and privacy</BenefitItem>
                  <BenefitItem>Provides authentication and data integrity</BenefitItem>
                  <BenefitItem>Enables secure digital transactions and communications</BenefitItem>
                  <BenefitItem>Protects sensitive information from unauthorized access</BenefitItem>
                </BenefitsList>
              </CryptoFieldBenefits>
            </CryptoFieldCard>
            
            <CryptoFieldCard>
              <CryptoFieldIcon>🔍</CryptoFieldIcon>
              <CryptoFieldTitle>Cryptology</CryptoFieldTitle>
              <CryptoFieldDescription>
                The broader study that encompasses both cryptography (creating secure systems) and cryptanalysis (breaking those systems), forming the complete science of information security.
              </CryptoFieldDescription>
              <CryptoFieldBenefits>
                <BenefitsTitle>Benefits:</BenefitsTitle>
                <BenefitsList>
                  <BenefitItem>Provides comprehensive understanding of security systems</BenefitItem>
                  <BenefitItem>Enables development of more robust security protocols</BenefitItem>
                  <BenefitItem>Bridges theoretical mathematics with practical applications</BenefitItem>
                  <BenefitItem>Forms the foundation for modern digital security infrastructure</BenefitItem>
                </BenefitsList>
              </CryptoFieldBenefits>
            </CryptoFieldCard>
            
            <CryptoFieldCard>
              <CryptoFieldIcon>⚔️</CryptoFieldIcon>
              <CryptoFieldTitle>Cryptanalysis</CryptoFieldTitle>
              <CryptoFieldDescription>
                The art of analyzing and breaking cryptographic systems to find weaknesses, vulnerabilities, or extract the original information without knowledge of the secret key.
              </CryptoFieldDescription>
              <CryptoFieldBenefits>
                <BenefitsTitle>Benefits:</BenefitsTitle>
                <BenefitsList>
                  <BenefitItem>Identifies vulnerabilities in security systems</BenefitItem>
                  <BenefitItem>Helps improve encryption algorithms and protocols</BenefitItem>
                  <BenefitItem>Essential for security testing and validation</BenefitItem>
                  <BenefitItem>Advances the field by challenging existing systems</BenefitItem>
                </BenefitsList>
              </CryptoFieldBenefits>
            </CryptoFieldCard>
          </CryptoFieldsGrid>
        </div>
      </CryptoFieldsSection>
      
      <CtaSection>
        <div className="container">
          <CtaContent>
            <CtaTitle>Ready to enhance your cryptography knowledge?</CtaTitle>
            <CtaText>Join our community of cryptography enthusiasts, researchers, and students.</CtaText>
            <CtaButton to="/login">Get Started</CtaButton>
          </CtaContent>
        </div>
      </CtaSection>
    </>
  );
};

const HeroSection = styled.section`
  background: linear-gradient(135deg, #f5f7ff 0%, #e9eeff 100%);
  padding: 30px 0;
  margin-top: -75px;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const AnimatedText = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.color};
  margin-bottom: 15px;
  transition: color 0.5s ease;
`;

const HeroText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

const CryptologyInfo = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 15px;
  text-align: center;
  line-height: 1.6;
  max-width: 900px;
  font-family: 'Georgia', 'Times New Roman', serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

// Add these new styled components for the additional sections
const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FeaturesSection = styled.section`
  padding: 2.5rem 0;
  background-color: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
`;

const PopularResourcesSection = styled.section`
  padding: 2.5rem 0;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ResourceCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const ResourceTitle = styled.h3`
  font-size: 1.1rem;
  padding: 1rem 1rem 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ResourceCategory = styled.p`
  font-size: 0.8rem;
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const ResourceLink = styled(Link)`
  display: block;
  padding: 0.8rem 1rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MoreResourcesLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CtaSection = styled.section`
  padding: 2.5rem 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: white;
`;

const CtaContent = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
`;

const CtaText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

// Add these new styled components for the cryptography fields section
const CryptoFieldsSection = styled.section`
  padding: 2.5rem 0;
  background-color: white;
`;

const CryptoFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CryptoFieldCard = styled.div`
  background-color: ${({ theme }) => `${theme.colors.backgroundAlt}`};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CryptoFieldIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const CryptoFieldTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const CryptoFieldDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-family: 'Georgia', 'Times New Roman', serif;
`;

const CryptoFieldBenefits = styled.div`
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  padding: 1rem;
  border-radius: 6px;
`;

const BenefitsTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const BenefitsList = styled.ul`
  padding-left: 1.5rem;
`;

const BenefitItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

export default Home;