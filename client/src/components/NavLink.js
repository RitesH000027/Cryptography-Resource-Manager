// For the active prop
const StyledNavLink = styled.a`
  color: ${props => props.$active ? '#6c5ce7' : '#333'};
  font-weight: ${props => props.$active ? '600' : '400'};
  // ... rest of your styles
`;

// Then in your component
return (
  <StyledNavLink 
    href={to} 
    $active={active}
    onClick={handleClick}
  >
    {children}
  </StyledNavLink>
);