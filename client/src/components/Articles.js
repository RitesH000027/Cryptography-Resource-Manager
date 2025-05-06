import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import ArticleCard from './ArticleCard';
import { API_URL } from '../config';
import './Articles.css';

const API_BASE_URL = 'http://localhost:5001/api';  // Change from 0.0.0.0 to localhost

const Articles = () => {
  const [articles, setArticles] = useState({ academic: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/articles/all`, {
          params: {
            page: currentPage,
            pageSize: itemsPerPage
          }
        });

        if (response.data.success) {
          setArticles(response.data.articles);
        } else {
          setError('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles');
      }
      setLoading(false);
    };

    fetchArticles();
  }, [currentPage, itemsPerPage]);

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container className="articles-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Academic Articles
      </Typography>
      <Grid container spacing={3} className="articles-grid">
        {articles.academic && articles.academic.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard article={article} type="academic" />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        News Articles
      </Typography>
      <Grid container spacing={3} className="articles-grid">
        {articles.news && articles.news.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard article={article} type="news" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Articles;