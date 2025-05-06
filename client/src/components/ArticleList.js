import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Pagination, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ArticleList = () => {
  const [academicArticles, setAcademicArticles] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalAcademic, setTotalAcademic] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/articles/all?page=${currentPage}&pageSize=${pageSize}`);
      
      if (response.data.success) {
        setAcademicArticles(response.data.articles.academic.items);
        setNewsArticles(response.data.articles.news.items);
        setTotalAcademic(response.data.articles.academic.total);
        setTotalNews(response.data.articles.news.total);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="article-list">
      <h2 className="mb-4">Latest Articles</h2>
      
      {/* Academic Articles */}
      <h3>Academic Articles</h3>
      <Row>
        {academicArticles.map(article => (
          <Col key={article.id} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              {article.image_url && (
                <Card.Img variant="top" src={article.image_url} alt={article.title} />
              )}
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.content?.substring(0, 150)}...</Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  Read More
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  By {article.author_name} on {new Date(article.created_at).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* News Articles */}
      <h3 className="mt-4">News Articles</h3>
      <Row>
        {newsArticles.map(article => (
          <Col key={article.id} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              {article.urlToImage && (
                <Card.Img variant="top" src={article.urlToImage} alt={article.title} />
              )}
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.description}</Card.Text>
                <Button 
                  variant="primary" 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read More
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  From {article.source} on {new Date(article.publishedAt).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          
          {[...Array(Math.ceil(Math.max(totalAcademic, totalNews) / pageSize))].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(Math.max(totalAcademic, totalNews) / pageSize)}
          />
          <Pagination.Last
            onClick={() => handlePageChange(Math.ceil(Math.max(totalAcademic, totalNews) / pageSize))}
            disabled={currentPage >= Math.ceil(Math.max(totalAcademic, totalNews) / pageSize)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default ArticleList;