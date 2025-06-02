import React from 'react';
import { Box, Container, Stack, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f8f9fa',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid #e9ecef'
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* 프로젝트 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              포트폴리오 공유 플랫폼
            </Typography>
            <Typography variant="body2" color="text.secondary">
              취업 준비생들의 포트폴리오를 효과적으로 공유하고 피드백을 받을 수 있는 플랫폼
            </Typography>
          </Box>

          {/* 팀원 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              팀원 정보
            </Typography>
            <Typography variant="body2" color="text.secondary">
              김선우 - 팀장<br />
              김민서 - 기획<br />
              김성철 - 데이터베이스<br />
              김영준 - 백엔드<br />
              김영빈 - 백엔드<br />
              이채운 - 디자인<br />
              진유성 - 프론트엔드
            </Typography>
          </Box>

          {/* 개발 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              개발 정보
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Frontend: React, TypeScript, Material-UI<br />
              Backend: Node.js, NestJS, TypeORM<br />
              Database: MySQL<br />
              Deployment: AWS EC2
            </Typography>
            <Box mt={2}>
              <Link href="https://github.com/ksw6823/gnuboardProject" color="inherit" target="_blank">
                GitHub Repository
              </Link>
            </Box>
          </Box>
        </Stack>

        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} 산학협력 프로젝트 팀 프로젝트
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 