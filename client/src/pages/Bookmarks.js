import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaVideo, FaFileAlt, FaBook, FaQuoteLeft, FaBookmark, FaTrash, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await axios.get('http://0.0.0.0:5001/api/bookmarks', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setBookmarks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookmarks');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchBookmarks();
  }, [user]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleRemoveBookmark = async (id) => {
    try {
      await axios.delete(`http://0.0.0.0:5001/api/bookmarks/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      setBookmarks(bookmarks.filter(bookmark => bookmark.resourceId !== id));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo />;
      case 'note':
        return <FaFileAlt />;
      case 'book':
        return <FaBook />;
      case 'citation':
        return <FaQuoteLeft />;
      default:
        return <FaFileAlt />;
    }
  };
  
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bookmark.resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <BookmarksContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>My Bookmarks</PageTitle>
          <PageDescription>
            Access your saved cryptography resources
          </PageDescription>
        </PageHeader>
        
        <SearchContainer>
          <SearchBar>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search bookmarks..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBar>
        </SearchContainer>
        
        {loading ? (
          <LoadingMessage>Loading bookmarks...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : bookmarks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaBookmark />
            </EmptyIcon>
            <EmptyTitle>No bookmarks yet</EmptyTitle>
            <EmptyDescription>
              Start bookmarking resources to save them for later.
            </EmptyDescription>
            <BrowseLink to="/resources">Browse Resources</BrowseLink>
          </EmptyState>
        ) : filteredBookmarks.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No matching bookmarks</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search term.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <BookmarksList>
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.resourceId}>
                <BookmarkContent>
                  <ResourceType>
                    {getTypeIcon(bookmark.resource.type)}
                    <span>{bookmark.resource.type.charAt(0).toUpperCase() + bookmark.resource.type.slice(1)}</span>
                  </ResourceType>
                  <BookmarkTitle to={`/resources/${bookmark.resourceId}`}>
                    {bookmark.resource.title}
                  </BookmarkTitle>
                  <BookmarkDescription>
                    {bookmark.resource.description.length > 150
                      ? `${bookmark.resource.description.substring(0, 150)}...`
                      : bookmark.resource.description}
                  </BookmarkDescription>
                  <BookmarkMeta>
                    <MetaItem>Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}</MetaItem>
                  </BookmarkMeta>
                </BookmarkContent>
                <BookmarkActions>
                  <RemoveButton onClick={() => handleRemoveBookmark(bookmark.resourceId)}>
                    <FaTrash />
                  </RemoveButton>
                </BookmarkActions>
              </BookmarkCard>
            ))}
          </BookmarksList>
        )}
      </div>
    </BookmarksContainer>
  );
};

const BookmarksContainer = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 3rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.error};
  padding: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const BrowseLink = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-3px);
  }
`;

const BookmarksList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const BookmarkCard = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const BookmarkContent = styled.div`
  flex: 1;
`;

const ResourceType = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const BookmarkTitle = styled(Link)`
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.8rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BookmarkDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const BookmarkMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MetaItem = styled.span`
  font-size: 0.9rem;
`;

const BookmarkActions = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 1rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}20`};
    color: ${({ theme }) => theme.colors.error};
  }
`;

export default Bookmarks;