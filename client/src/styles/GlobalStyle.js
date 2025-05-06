import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  main {
    min-height: calc(100vh - 160px);
    padding: 80px 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  .btn-secondary {
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }

  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  .mt-5 { margin-top: 2.5rem; }

  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  .mb-5 { margin-bottom: 2.5rem; }
`;

export default GlobalStyle;