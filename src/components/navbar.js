import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Logic untuk logout, bisa redirect ke halaman login
    console.log('Logging out...');
    window.location.href = '/login'; // Redirect ke halaman login
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.burgerMenu} onClick={toggleMenu}>
        <div className={styles.burgerLine}></div>
        <div className={styles.burgerLine}></div>
        <div className={styles.burgerLine}></div>
      </div>

      <div className={styles.navLinks}>
        {/* Logo Profile dengan Font Awesome Icon */}
        <div className={styles.profileSection}>
          <i className={`fas fa-user-circle ${styles.profileIcon}`}></i>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
            <i className={`fas fa-sign-out-alt ${styles.logoutIcon}`}></i> {/* Ikon logout */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
