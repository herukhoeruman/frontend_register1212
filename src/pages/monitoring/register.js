import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/layouts';
import Navbar from '../../components/navbar';
import styles from '../../styles/Regismonitor.module.css';

const Register = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    const authToken = localStorage.getItem("authToken");
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiBaseUrl}/api/get-signers?page=${currentPage}&limit=10&search=${searchTerm}&status=${statusFilter}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await axios.request(config);
      setData(response.data.data); 
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-'; 
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
  };

  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman pertama
  }, [searchTerm, statusFilter]);
  
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  const filteredData = data.filter((row) =>
    (row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.privy_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.registration_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phone?.includes(searchTerm)) &&
    (statusFilter ? row.status === statusFilter : true)
  );

  const openModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Membuat nomor halaman berdasarkan startPage dan endPage
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Layout>
      <Navbar />
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.card}>
          <div className={styles.cardTitleContainer}>
            <i className={`fa-regular fa-id-card ${styles.cardTitleIcon}`}></i>
            <span className={styles.cardTitleText}>Register Monitoring</span>
          </div>
            <div className={styles.searchFilterContainer}>
              <div className={styles.searchInputWrapper}>
                <i className={`fa fa-search ${styles.searchIcon}`}></i>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search by Name, Email, Privy ID or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.filterContainer}>
                <i className={`fa fa-filter ${styles.filterIcon}`}></i>
                <select
                  className={styles.searchInput}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Registration URL</th>
                    <th>Email</th>
                    <th>Privy ID</th>
                    <th>Phone</th>
                    <th>NIK</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Unit PLN</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.id} onClick={() => openModal(row)}>
                      <td>{row.registration_url}</td>
                      <td>{row.email}</td>
                      <td>{row.privy_id}</td>
                      <td>{row.phone}</td>
                      <td>{row.nik}</td>
                      <td>{row.name}</td>
                      <td>{formatDate(row.dob)}</td>
                      <td>{row.unit_pln?.nama}</td>
                      <td>
                      <button
                        className={`${styles.statusButton} ${
                          row.status === 'verified' ? styles.verified :
                          row.status === 'pending' ? styles.pending :
                          row.status === 'rejected' ? styles.rejected : ''
                        }`}
                      >
                        <i className={`fa-solid ${
                          row.status === 'verified' ? 'fa-check' :
                          row.status === 'pending' ? 'fa-spinner' :
                          row.status === 'rejected' ? 'fa-ban' : ''
                        }`}></i>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </button>
                    </td>
                      <td>
                        <button className={styles.actionButton} onClick={() => openModal(row)}>
                          <i className="fa-solid fa-outdent" style={{ marginRight: '5px' }}></i>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button
                className={`${styles.pageButton} ${styles.firstButton}`}
                onClick={() => setCurrentPage(1)} // Navigasi ke halaman pertama
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`${styles.pageButton} ${styles.prevButton}`}
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                &laquo; 
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={`${styles.pageButton} ${styles.nextButton}`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
              <button
                className={`${styles.pageButton} ${styles.lastButton}`}
                onClick={() => setCurrentPage(totalPages)} // Navigasi ke halaman terakhir
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>

          </div>

          {/* Pagination */}
        </div>
      </div>

      {isModalOpen && selectedRow && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>
              &times;
            </button>
            <h2 className={styles.h2}>Detail Information</h2>
            <div className={styles.modalContent}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Registration URL</label>
                <div className={styles.inputBox}>{selectedRow.registration_url}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Reference Number</label>
                <div className={styles.inputBox}>{selectedRow.reference_number}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Channel ID</label>
                <div className={styles.inputBox}>{selectedRow.channel_id}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Name</label>
                <div className={styles.inputBox}>{selectedRow.name}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputBox}>{selectedRow.email}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Phone</label>
                <div className={styles.inputBox}>{selectedRow.phone}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Privy ID</label>
                <div className={styles.inputBox}>{selectedRow.privy_id}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>NIK</label>
                <div className={styles.inputBox}>{selectedRow.nik}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Date of Birth</label>
                <div className={styles.inputBox}>{selectedRow.dob}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Unit PLN</label>
                <div className={styles.inputBox}>{selectedRow.unit_pln?.nama}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Status</label>
                <div className={styles.inputBox}>{selectedRow.status}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Created</label>
                <div className={styles.inputBox}>{selectedRow.createdAt}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Updated</label>
                <div className={styles.inputBox}>{selectedRow.updatedAt}</div>
              </div>
              {selectedRow.status === 'rejected' && (
              <div className={styles.inputContainer}>
                <label className={styles.label}>Reject Reason</label>
                <div className={styles.inputBox}>{selectedRow.reject_reason?.reason}</div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Register;
