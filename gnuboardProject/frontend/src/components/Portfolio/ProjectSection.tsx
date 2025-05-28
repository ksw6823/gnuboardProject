import React, { useState } from 'react';
import { TextField, Box, Typography, Button } from '@mui/material';

interface Project {
  name: string;
  description: string;
  period: string;
}

interface ProjectSectionProps {
  onChange: (projects: Project[]) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ onChange }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', period: '' });

  const handleAddProject = () => {
    if (newProject.name && newProject.description && newProject.period) {
      setProjects([...projects, newProject]);
      onChange([...projects, newProject]);
      setNewProject({ name: '', description: '', period: '' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        프로젝트
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="프로젝트명"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="설명"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="기간"
          value={newProject.period}
          onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddProject}>
          추가
        </Button>
      </Box>
      {projects.map((project, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography variant="subtitle1">{project.name}</Typography>
          <Typography variant="body2">{project.description}</Typography>
          <Typography variant="caption">{project.period}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ProjectSection; 