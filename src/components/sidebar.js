import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();

  // Fungsi untuk memeriksa apakah submenu aktif
  const isMonitoringActive = router.pathname.startsWith('/monitoring');

  return (
    <div className={styles.sidebar}>
      <div className={styles.icon}>
        <img src="/pln-no.png" alt="Logo" className={styles.logo} />
      </div>
      <div className={styles.menuTitle}>Menu</div>

      {/* Menu Register */}
      <div
        className={`${styles.menuItem} ${router.pathname === '/register' ? styles.active : ''}`}
      >
        <Link href="/register">
          <i className="fas fa-user-plus" style={{ marginRight: '10px' }}></i>
          Register
        </Link>
      </div>

      {/* Menu Monitoring */}
      <div
        className={`${styles.menuItem} ${isMonitoringActive ? styles.active : ''}`}
      >
        <div>
          <i className="fas fa-tasks" style={{ marginRight: '10px' }}></i>
          Monitoring
          <span className={`${styles.arrow} ${isMonitoringActive ? styles.active : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={styles.arrowIcon}
            >
              <path d="M135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z" />
            </svg>
          </span>
        </div>

        {/* Dropdown Monitoring */}
        <div
          className={`${styles.dropdown} ${isMonitoringActive ? styles.active : ''}`}
        >
          {/* Submenu Register */}
          <div
            className={`${styles.menuItem} ${router.pathname === '/monitoring/register' ? styles.active : ''}`}
          >
            <Link href="/monitoring/register">
              <i className="fa-regular fa-id-card" style={{ marginRight: '10px' }}></i>
              Register
            </Link>
          </div>
          {/* Submenu Document Sign */}
          <div
            className={`${styles.menuItem} ${router.pathname === '/monitoring/document-sign' ? styles.active : ''}`}
          >
            <Link href="/monitoring/document-sign">
              <i className="fas fa-signature" style={{ marginRight: '10px' }}></i>
              Document Sign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
