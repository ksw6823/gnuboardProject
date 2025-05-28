import React, { useState } from 'react';
import { TextField, Box, Typography, Button } from '@mui/material';

interface Skill {
  skill_id: number;
  level: string;
}

interface SkillSectionProps {
  onChange: (skills: Skill[]) => void;
}

const SkillSection: React.FC<SkillSectionProps> = ({ onChange }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ skill_id: 0, level: '' });

  const handleAddSkill = () => {
    if (newSkill.skill_id && newSkill.level) {
      setSkills([...skills, newSkill]);
      onChange([...skills, newSkill]);
      setNewSkill({ skill_id: 0, level: '' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        기술 스택
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="기술 ID"
          type="number"
          value={newSkill.skill_id}
          onChange={(e) => setNewSkill({ ...newSkill, skill_id: Number(e.target.value) })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="수준"
          value={newSkill.level}
          onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddSkill}>
          추가
        </Button>
      </Box>
      {skills.map((skill, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography>
            기술 ID: {skill.skill_id}, 수준: {skill.level}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SkillSection; 