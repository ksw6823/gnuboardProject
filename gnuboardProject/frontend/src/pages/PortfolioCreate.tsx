import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, TextField, Box, Typography, Container, Paper, Grid, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import SkillSection from '../components/portfolio/SkillSection';
import JobSection from '../components/portfolio/JobSection';
import ProjectSection from '../components/portfolio/ProjectSection';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface PortfolioData {
  title: string;
  summary: string;
  content: string;
  is_private: boolean;
  portfolio_skills: Array<{ skill_id: number; level: string }>;
  portfolio_jobs: Array<{ company: string; position: string; period: string }>;
  portfolio_projects: Array<{ name: string; description: string; period: string }>;
}

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PortfolioData>({
    title: '',
    summary: '',
    content: '',
    is_private: false,
    portfolio_skills: [],
    portfolio_jobs: [],
    portfolio_projects: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_private' ? checked : value
    }));
  };

  const handleSkillsChange = (skills: Array<{ skill_id: number; level: string }>) => {
    setFormData(prev => ({
      ...prev,
      portfolio_skills: skills
    }));
  };

  const handleJobsChange = (jobs: Array<{ company: string; position: string; period: string }>) => {
    setFormData(prev => ({
      ...prev,
      portfolio_jobs: jobs
    }));
  };

  const handleProjectsChange = (projects: Array<{ name: string; description: string; period: string }>) => {
    setFormData(prev => ({
      ...prev,
      portfolio_projects: projects
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('Form submitted:', formData);
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          로그인이 필요한 서비스입니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          포트폴리오 작성
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledPaper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="제목"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="요약"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="내용"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_private}
                      onChange={handleChange}
                      name="is_private"
                    />
                  }
                  label="비공개"
                />
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper>
            <SkillSection onChange={handleSkillsChange} />
          </StyledPaper>

          <StyledPaper>
            <JobSection onChange={handleJobsChange} />
          </StyledPaper>

          <StyledPaper>
            <ProjectSection onChange={handleProjectsChange} />
          </StyledPaper>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              저장
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PortfolioCreate; 