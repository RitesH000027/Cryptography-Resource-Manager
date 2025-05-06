import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, styled } from '@mui/material';

const CardWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover .hover-card': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  }
}));

const HoverCard = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  borderRadius: theme.shape.borderRadius,
  zIndex: 9999,
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease-in-out',
  marginTop: '10px',
  maxWidth: '100%',
  width: '100%',
  pointerEvents: 'none',
  '& .metadata-grid': {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  '& .metadata-label': {
    fontWeight: 'bold',
    color: theme.palette.text.secondary
  },
  '& .metadata-value': {
    color: theme.palette.text.primary
  }
}));

const ArticleCard = ({ article, type }) => {
  if (type === 'news') {
    return (
      <CardWrapper>
        <Card className="article-card">
          <CardContent>
            <Typography variant="h6" component="h2">
              {article.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Source: {article.source}
            </Typography>
            <Typography variant="body2" component="p">
              {article.description}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ marginTop: '1rem' }}
            >
              Read More
            </Button>
          </CardContent>
        </Card>
        <HoverCard className="hover-card">
          <Typography variant="h6" gutterBottom>
            {article.title}
          </Typography>
          <div className="metadata-grid">
            <Typography className="metadata-label">Source:</Typography>
            <Typography className="metadata-value">{article.source}</Typography>
            
            <Typography className="metadata-label">Published:</Typography>
            <Typography className="metadata-value">
              {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'N/A'}
            </Typography>
            
            <Typography className="metadata-label">Category:</Typography>
            <Typography className="metadata-value">{article.category || 'N/A'}</Typography>
            
            <Typography className="metadata-label">Type:</Typography>
            <Typography className="metadata-value">{article.type || 'News Article'}</Typography>
          </div>
          
          <Typography variant="body2" paragraph>
            {article.description}
          </Typography>
          
          <Typography variant="caption" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
            Click to read the full article
          </Typography>
        </HoverCard>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Card className="article-card">
        <CardContent>
          <Typography variant="h6" component="h2">
            {article.title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            By {article.author_name}
          </Typography>
          <Typography variant="body2" component="p">
            {article.content?.substring(0, 200)}...
          </Typography>
          <Link to={`/articles/${article.id}`}>
            <Button 
              variant="contained" 
              color="primary"
              style={{ marginTop: '1rem' }}
            >
              Read More
            </Button>
          </Link>
        </CardContent>
      </Card>
      <HoverCard className="hover-card">
        <Typography variant="h6" gutterBottom>
          {article.title}
        </Typography>
        <div className="metadata-grid">
          <Typography className="metadata-label">Author:</Typography>
          <Typography className="metadata-value">{article.author_name}</Typography>
          
          <Typography className="metadata-label">Published:</Typography>
          <Typography className="metadata-value">
            {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'N/A'}
          </Typography>
          
          <Typography className="metadata-label">Category:</Typography>
          <Typography className="metadata-value">{article.category || 'N/A'}</Typography>
          
          <Typography className="metadata-label">Reading Time:</Typography>
          <Typography className="metadata-value">{article.readingTime || 'N/A'}</Typography>
        </div>
        
        <Typography variant="body2" paragraph>
          {article.content?.substring(0, 200)}...
        </Typography>
        
        <Typography variant="caption" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
          Click to read the full article
        </Typography>
      </HoverCard>
    </CardWrapper>
  );
};

export default ArticleCard;