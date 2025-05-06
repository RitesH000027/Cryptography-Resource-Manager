import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';

const IACRNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/iacr-news');
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching IACR news:', err);
        setError('Failed to fetch IACR news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <span>Loading IACR news...</span>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <NewsContainer>
      <NewsHeader>
        <h2>Latest IACR News</h2>
        <p>Recent updates from the International Association for Cryptologic Research</p>
      </NewsHeader>
      
      <NewsList>
        {news.map((item, index) => (
          <NewsItem key={index}>
            <NewsTitle>
              {item.title}
              {item.link && (
                <ExternalLink href={item.link} target="_blank" rel="noopener noreferrer">
                  <FaExternalLinkAlt />
                </ExternalLink>
              )}
            </NewsTitle>
            {item.published && (
              <div className="published-date">
                {new Date(item.published).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
            {item.summary && (
              <div className="summary" dangerouslySetInnerHTML={{ __html: item.summary }} />
            )}
          </NewsItem>
        ))}
      </NewsList>
    </NewsContainer>
  );
};

const NewsContainer = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NewsHeader = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1rem;
  }
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NewsItem = styled.li`
  padding: 1.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }

  .published-date {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .summary {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    line-height: 1.5;
    margin-top: 0.5rem;
  }
`;

const NewsTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 1rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  .spinner {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 1rem;
`;

export default IACRNews;