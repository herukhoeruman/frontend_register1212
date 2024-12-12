import Sidebar from '../components/sidebar';
import styles from '../styles/Layouts.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
