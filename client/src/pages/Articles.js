import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [hoveredArticle, setHoveredArticle] = useState(null);
  
  const categories = [
    { id: 'all ', name: 'All' },
    { id: 'announcement', name: 'Announcement' },
    { id: 'election', name: 'Election' },
    { id: 'award', name: 'Award' },
    { id: 'school', name: 'School' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'eurocrypt', name: 'Eurocrypt' },
    { id: 'asiacrypt', name: 'Asiacrypt' },
    { id:'ches', name: 'CHES' },
    { id:'fse', name: 'FSE' },
    { id:'pkc', name: 'PKC' },
    { id: 'tcc', name: 'TCC' },
    { id: 'real_world_crypto', name: 'Real World Crypto' },
    { id: 'journal_of_cryptology', name: 'Journal Of Cryptology' },
    { id:'communications_in_cryptology', name: 'Communications In Cryptology' },
    { id:'ePrint_report', name: 'ePrint Report' },
    { id:'job_posting', name: 'Job Posting' },
    { id:'event_calender', name: 'Event Calender' }
  ];
  // Remove the newlyLoadedArticles state since we'll use a single loader
  
  // Function to fetch articles from IACR news
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/iacr-news');
      
      if (response.data) {
        const filteredItems = response.data
          .filter(item => {
            const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'all' || item.category?.toLowerCase() === category.toLowerCase();
            return matchesSearch && matchesCategory;
          })
          .map((item, index) => ({
            id: index,
            title: item.title,
            url: item.link,
            category: item.category || 'uncategorized',
            source: 'IACR'
          }));

        setArticles(filteredItems);
      } else {
        console.error('API returned unsuccessful response:', response);
        setError('Failed to fetch articles from IACR');
      }
    } catch (err) {
      console.error('Error fetching IACR articles:', err);
      setError('Failed to fetch articles from IACR: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]);

  // Initial fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  // Update category handler - simplified since we only have IACR news
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <ArticlesContainer>
      <div className="container">
        <ArticlesHeader>
          <h1>Cryptography News Articles</h1>
          <p>Stay updated with the latest news and developments in cryptography</p>
        </ArticlesHeader>
        
        <SearchFilterContainer>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search for articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchForm>
          
          {/* <FilterContainer>
            <FilterIcon>
              <FaFilter />
            </FilterIcon>
            <FilterSelect 
              value={category} 
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </FilterSelect>
          </FilterContainer> */}
        </SearchFilterContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <MainSection>
          <SectionHeader>
            <h1>IACR News Articles</h1>
          </SectionHeader>
          <ScrollableList>
            {articles.map((article) => (
              <ArticleItem
                key={article.id}
                onMouseEnter={() => setHoveredArticle(article)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <ArticleTitle>
                  {article.title}
                  {article.url && (
                    <ExternalLink href={article.url} target="_blank" rel="noopener noreferrer">
                      <FaExternalLinkAlt />
                    </ExternalLink>
                  )}
                </ArticleTitle>
                <HoverCard className="hover-card">
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>
                    {article.description || 'No description available'}
                  </CardDescription>
                  <CardMeta>
                    <MetaItem>
                      <strong>Source:</strong> {article.source}
                    </MetaItem>
                    <MetaItem>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </MetaItem>
                  </CardMeta>
                  <ReadMoreButton href={article.url} target="_blank" rel="noopener noreferrer">
                    Read More
                  </ReadMoreButton>
                </HoverCard>
              </ArticleItem>
            ))}
          </ScrollableList>
        </MainSection>
        
        {loading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
        
        {!loading && articles.length === 0 && !error && (
          <NoResults>No articles found. Try a different search term or category.</NoResults>
        )}
      </div>
    </ArticlesContainer>
  );
};

const ArticlesContainer = styled.div`
  padding: 2rem 0;
  margin-top: -65px;
  background: ${({ theme }) => theme.colors.backgroundLight};
  min-height: 100vh;
`;

const ArticlesHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  flex: 1;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: 8px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.danger}20;
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  text-align: center;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
`;

const Section = styled.div`
  // background: ${({ theme }) => theme.colors.background};
  background: #e7e2e2;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: black 0px 0px 10px 0px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;


  h1 {
    font-size: 1.8rem;
    color: black;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 3px;
      background: blaCK;
      border-radius: 2px;
    }
  }
`;

const SectionsWrapper = styled.div`
  margin-top: 2rem;
`;

const ScrollableList = styled.div`
  height: 600px;
  overflow-y: auto;
  padding: 1rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundLight};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: gray;
    border-radius: 4px;
  }
`;

const ArticleItem = styled.div`
  position: relative;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    
    .hover-card {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
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

const ArticleTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem 1.5rem;
  background-color: #d2d4d6;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const HoverCard = styled.div`
  position: absolute;
  top: 0;
  right: -320px;
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 10;
`;

const CardTitle = styled.h4`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CardMeta = styled.div`
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
  
  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ReadMoreButton = styled.a`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Sidebar = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export default Articles;