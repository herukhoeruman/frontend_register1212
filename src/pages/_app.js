import "@/styles/globals.css";
import Layout from '../components/layouts';
//import Navbar from '../components/navbar'; // Mengimpor Navbar

export default function App({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  );
}
