import React, { useState } from 'react';
import { TextField, Box, Typography, Button } from '@mui/material';

interface Job {
  company: string;
  position: string;
  period: string;
}

interface JobSectionProps {
  onChange: (jobs: Job[]) => void;
}

const JobSection: React.FC<JobSectionProps> = ({ onChange }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState({ company: '', position: '', period: '' });

  const handleAddJob = () => {
    if (newJob.company && newJob.position && newJob.period) {
      setJobs([...jobs, newJob]);
      onChange([...jobs, newJob]);
      setNewJob({ company: '', position: '', period: '' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        경력 사항
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="회사"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="직책"
          value={newJob.position}
          onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="기간"
          value={newJob.period}
          onChange={(e) => setNewJob({ ...newJob, period: e.target.value })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddJob}>
          추가
        </Button>
      </Box>
      {jobs.map((job, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography>
            {job.company} - {job.position} ({job.period})
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default JobSection; 