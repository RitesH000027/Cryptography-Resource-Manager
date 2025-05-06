import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Lectures = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching courses...');
        
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        
        // Make the API request with the auth token
        const response = await axios.get('http://localhost:5001/api/courses', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          params: { timestamp: new Date().getTime() } // Add cache-busting parameter
        });
        
        console.log('Fetched courses:', response.data);
        
        // Check if we have courses data in the expected format
        let coursesData = [];
        if (response.data && Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (response.data && response.data.value && Array.isArray(response.data.value)) {
          coursesData = response.data.value;
        }
        
        console.log('Processed courses data:', coursesData);
        
        // Set courses and select the first one if available
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch lectures when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchLectures = async () => {
        setLoading(true);
        try {
          console.log(`Fetching lectures for course ID: ${selectedCourse}`);
          
          // Get the authentication token from localStorage
          const token = localStorage.getItem('token');
          
          // First try to fetch from the course/:courseId endpoint
          const response = await axios.get(`http://localhost:5001/api/lectures/course/${selectedCourse}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : ''
            },
            params: { timestamp: new Date().getTime() } // Add cache-busting parameter
          });
          console.log('Fetched lectures:', response.data);
          setLectures(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching lectures from course endpoint:', error);
          
          try {
            // If that fails, try to fetch all lectures and filter client-side
            console.log('Trying to fetch all lectures and filter client-side...');
            
            // Get the authentication token from localStorage
            const token = localStorage.getItem('token');
            
            const allLecturesResponse = await axios.get('http://localhost:5001/api/lectures', {
              headers: {
                'Authorization': token ? `Bearer ${token}` : ''
              },
              params: { timestamp: new Date().getTime() } // Add cache-busting parameter
            });
            console.log('All lectures:', allLecturesResponse.data);
            
            // Handle different data formats - some might use course_id, others courseId
            const filteredLectures = allLecturesResponse.data.filter(lecture => {
              const lectureId = lecture.course_id || lecture.courseId;
              return lectureId === parseInt(selectedCourse) || lectureId === selectedCourse;
            });
            
            console.log('Filtered lectures:', filteredLectures);
            setLectures(filteredLectures);
            setError(null);
          } catch (secondError) {
            console.error('Error fetching all lectures:', secondError);
            setError('Failed to load lectures. Please try again later.');
            setLectures([]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchLectures();
    }
  }, [selectedCourse]);

  return (
    <LecturesContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Cryptography Lectures</PageTitle>
          <PageDescription>
            Explore our comprehensive collection of cryptography lectures at IIITD
          </PageDescription>
        </PageHeader>

        <SectionContainer>
          <SelectWrapper>
            <StyledSelect 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id.toString()}>
                  {course.title || course.name || `Course ${course.id}`}
                </option>
              ))}
            </StyledSelect>
          </SelectWrapper>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {selectedCourse && (
            <TableContainer>
              {/* Display the selected course title */}
              {!loading && selectedCourse && (
                <CourseTitle>
                  {courses.find(course => course.id.toString() === selectedCourse.toString())?.title || 
                   courses.find(course => course.id.toString() === selectedCourse.toString())?.name || 
                   `Course ${selectedCourse}`}
                </CourseTitle>
              )}
              
              {loading ? (
                <LoadingText>Loading lectures...</LoadingText>
              ) : lectures.filter(lecture => lecture.course_id.toString() === selectedCourse).length > 0 ? (
                <LectureTable>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Topic</th>
                      <th>Date</th>
                      <th>Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures
                      .filter(lecture => lecture.course_id.toString() === selectedCourse)
                      .map((lecture, index) => (
                      <tr key={lecture.id}>
                        <td>{index + 1}</td>
                        <td>{lecture.title || lecture.topic || 'Untitled Lecture'}</td>
                        <td>
                          {(lecture.lecture_date || lecture.date) 
                            ? new Date(lecture.lecture_date || lecture.date).toLocaleDateString() 
                            : 'N/A'}
                        </td>
                        <td>
                          <ResourceLinks>
                            {lecture.slides_url && (
                              <DownloadButton 
                                href={lecture.slides_url.startsWith('http') 
                                  ? lecture.slides_url 
                                  : `http://localhost:5001${lecture.slides_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Slides
                              </DownloadButton>
                            )}
                            {lecture.video_url && (
                              <DownloadButton 
                                href={lecture.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video"
                              >
                                Video
                              </DownloadButton>
                            )}
                          </ResourceLinks>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </LectureTable>
              ) : (
                <EmptyMessage>No lectures found for this course.</EmptyMessage>
              )}
            </TableContainer>
          )}
        </SectionContainer>
      </div>
    </LecturesContainer>
  );
};

const LecturesContainer = styled.div`
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

const CourseTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: left;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: 0.5rem;
`;

const SectionContainer = styled.div`
  margin-top: 3rem;
  
  .select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 400px;
    margin-bottom: 2rem;
  }
`;

const SelectWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
  position: relative;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  background-color: white;
  color: #333;
  cursor: pointer;
  appearance: menulist;
  -webkit-appearance: menulist;
  -moz-appearance: menulist;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  option {
    padding: 10px;
    font-size: 1rem;
    color: #333;
    background-color: white;
  }
`;

/* Styles for the dropdown are defined above */

const TableContainer = styled.div`
  overflow-x: auto;
`;

const LectureTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray}30;
  }

  th {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 500;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.gray}10;
  }
`;

const ResourceLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: ${props => props.className === 'video' ? '#e53935' : props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${props => props.className === 'video' ? '#c62828' : props.theme.colors.primaryDark};
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 2rem 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 2rem 0;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

export default Lectures;