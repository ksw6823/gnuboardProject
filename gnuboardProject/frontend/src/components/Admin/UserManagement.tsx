import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background: #f8f9fa;
    font-weight: bold;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &.edit {
    background: #28a745;
    color: #fff;
    margin-right: 0.5rem;
    
    &:hover {
      background: #218838;
    }
  }
  
  &.delete {
    background: #dc3545;
    color: #fff;
    
    &:hover {
      background: #c82333;
    }
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    
    &:hover {
      background: #f8f9fa;
    }
    
    &.active {
      background: #007bff;
      color: #fff;
      border-color: #007bff;
    }
  }
`;

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotal(data.total);
      } else {
        throw new Error('사용자 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 목록 조회 중 오류가 발생했습니다:', error);
      alert('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert('사용자 역할이 변경되었습니다.');
      } else {
        throw new Error('사용자 역할 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 역할 변경 중 오류가 발생했습니다:', error);
      alert('사용자 역할 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        alert('사용자가 삭제되었습니다.');
      } else {
        throw new Error('사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 삭제 중 오류가 발생했습니다:', error);
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const totalPages = Math.ceil(total / 10);

  return (
    <Container>
      <Title>사용자 관리</Title>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디</th>
            <th>이름</th>
            <th>역할</th>
            <th>가입일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>
                <Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">일반 사용자</option>
                  <option value="admin">관리자</option>
                </Select>
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <Button
                  className="delete"
                  onClick={() => handleDelete(user.id)}
                  disabled={user.role === 'admin'}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </Pagination>
    </Container>
  );
};

export default UserManagement; 