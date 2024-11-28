import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Welcome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data);
      } catch (error) {
        alert(error.response?.data?.msg || 'Error fetching user');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      <h2>Welcome</h2>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Welcome;
