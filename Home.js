import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Wedding',
      image: 'https://theweddinginc.com/wp-content/uploads/2020/05/SVV-Kalyana-Mandapam-Chennai.jpg'
    },
    {
      name: 'Birthday',
      image: 'https://queenspartyhall.com/wp-content/uploads/2020/01/atlantis2-1536x960.jpg'
    },
    {
      name: 'Meeting',
      image: 'https://www.oyorooms.com/blog/wp-content/uploads/2018/03/proper-seating-arrangement.jpg'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  const handleAdminLoginRedirect = () => {

    navigate('/admin-login');
  };
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/cb/28/86/cb2886202fdaf197b2459e9ffcba4917.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          borderRadius: '10px',
          marginBottom: '30px'
        }}
      >
        Welcome to Hall Booking
      </div>

      <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#28a745' }}>
  Explore Hall Options
</h1>


      {/* Search by Category Name */}
      <div style={{ margin: '10px 0 20px 0', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search halls here...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Filtered Categories */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                cursor: 'pointer',
                height: '200px',
                backgroundImage: `url('${cat.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                textAlign: 'center',
                borderRadius: '10px',
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                textShadow: '2px 2px 5px rgba(0,0,0,0.8)'
              }}
            >
              {cat.name} Halls
            </div>
          ))
        ) : (
          <p>No matching categories found.</p>
        )}
      </div>
      <hr style={{ margin: '30px 0' }} />
      <h2 style={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#28a745' }}>🔐 Admin Login</h2>
      <button
        onClick={handleAdminLoginRedirect} // Navigate to Admin Login page
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontWeight: 'bold'
        }}
      >
        Login as Admin
      </button>
    </div>
  );
};

export default Home;
