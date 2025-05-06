// For the isOpen prop
const MobileMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  z-index: 1001;
  // ... rest of your styles
`;

// Then in your component
return (
  <MobileMenuContainer $isOpen={isOpen}>
    {/* ... rest of your component */}
  </MobileMenuContainer>
);