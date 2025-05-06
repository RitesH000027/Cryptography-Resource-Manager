import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    margin-bottom: 10px;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 {
    font-size: 2.2rem;
    margin-top: 10px;
  }

  h2 {
    font-size: 1.8rem;
    margin-top: 8px;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 6px;
  }

  p {
    margin-bottom: 10px;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .section {
    padding: 30px 0;
  }

  button {
    cursor: pointer;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyles;