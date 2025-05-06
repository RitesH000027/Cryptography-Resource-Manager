import styled from 'styled-components';

// Update styled components to use transient props ($ prefix)
export const NavItem = styled.div`
  // ...existing styles...
  ${props => props.$active && `
    background-color: #2c3e50;
    color: white;
  `}
`;

export const Drawer = styled.div`
  // ...existing styles...
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
`;
// ...existing code...