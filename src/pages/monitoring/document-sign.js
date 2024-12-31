import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/layouts';
import Navbar from '../../components/navbar';
import styles from '../../styles/Documentsign.module.css';

const DocumentSign = () => {
  const [data, setData] = useState([]); // State untuk menyimpan data dari API
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // Total halaman dari API
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    const authToken = localStorage.getItem("authToken");
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiBaseUrl}/api/get-documents?page=${currentPage}&limit=10&search=${searchTerm}&status=${statusFilter}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await axios.request(config);
      setData(response.data.data); // Sesuaikan dengan struktur data API Anda
      setTotalPages(Math.ceil(response.data.total / 10)); // Hitung total halaman berdasarkan total dan limit
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Mengambil data saat komponen dimuat atau saat halaman berubah
  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman pertama
  }, [searchTerm, statusFilter]);
  
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  // Filter data berdasarkan pencarian dan status
  const filteredData = data.filter((row) =>
    (row.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.no_trx?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.document_token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.reference_number?.includes(searchTerm)) &&
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
            <i className={`fas fa-signature ${styles.cardTitleIcon}`}></i>
            <span className={styles.cardTitleText}>Document Sign Monitoring</span>
          </div>
            <div className={styles.searchFilterContainer}>
              <div className={styles.searchInputWrapper}>
                <i className={`fa fa-search ${styles.searchIcon}`}></i>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search by No Transaksi, Reference Number,..."
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
                  <option value="completed">Completed</option>
                  <option value="link_expired">Link Expired</option>
                  <option value="blocked">Blocked</option>
                  <option value="processing">Processing</option>
                  <option value="uploaded">Uploaded</option>
                </select>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>No Transaksi</th> 
                    <th>Reference Number</th>                  
                    <th>Document Token</th>
                    <th>URL Sign</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.id} onClick={() => openModal(row)}>
                      <td>{row.id}</td>
                      <td>{row.no_trx}</td>
                      <td>{row.reference_number}</td>
                      <td>{row.document_token}</td>
                      <td>{row.signing_url}</td>                                            
                      <td>
                        <button
                          className={`${styles.statusButton} ${
                            row.status === 'completed' ? styles.completed :
                            row.status === 'link_expired' ? styles.expired :
                            row.status === 'processing' ? styles.processing :
                            row.status === 'blocked' ? styles.blocked :
                            row.status === 'uploaded' ? styles.uploaded : ''
                          }`}
                        >
                          <i className={`fa-solid ${
                            row.status === 'completed' ? 'fa-check' :
                            row.status === 'link_expired' ? 'fa-times' :
                            row.status === 'processing' ? 'fa-spinner' :
                            row.status === 'blocked' ? 'fa-ban' :
                            row.status === 'uploaded' ? 'fa-upload' : ''
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
                <label className={styles.label}>ID</label>
                <div className={styles.inputBox}>{selectedRow.id}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>No Transaksi</label>
                <div className={styles.inputBox}>{selectedRow.no_trx}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Type Transaksi</label>
                <div className={styles.inputBox}>{selectedRow.type_trx}</div>
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
                <label className={styles.label}>Document Token</label>
                <div className={styles.inputBox}>{selectedRow.document_token}</div>
              </div>
              <div className={styles.inputContainer}>
                {selectedRow.signing_url ? (
                  <>
                    <label className={styles.label}>URL Sign</label>
                    <div className={styles.inputBox}>{selectedRow.signing_url}</div>
                  </>
                ) : (
                  <>
                    <label className={styles.label}>URLS Sign</label>
                    <div className={styles.inputBox}>
                      {selectedRow.signing_urls ? (
                        Object.values(selectedRow.signing_urls).join(', ') || '-'
                      ) : (
                        '-'
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>File</label>
                <div className={styles.inputBox}>{selectedRow.file_name}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Created</label>
                <div className={styles.inputBox}>{selectedRow.createdAt}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Updated</label>
                <div className={styles.inputBox}>{selectedRow.updatedAt}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Status</label>
                <div className={styles.inputBox}>{selectedRow.status}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Recipient Count</label>
                <div className={styles.inputBox}>{selectedRow.recipient_count}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>e-Meterai Count</label>
                <div className={styles.inputBox}>{selectedRow.e_meterai_count}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>e-Meterai Doc Category</label>
                <div className={styles.inputBox}>{selectedRow.e_meterai?.doc_category || "-"}</div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>e-Meterai Stamp Position</label>
                <div className={styles.inputBox}>
                  Page: {selectedRow.e_meterai?.stamp_position?.[0]?.page || "-"},
                  X: {selectedRow.e_meterai?.stamp_position?.[0]?.pos_x || "-"},
                  Y: {selectedRow.e_meterai?.stamp_position?.[0]?.pos_y || "-"}
                </div>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Recipient Details</label>
                <div className={styles.inputBox}>
                  {selectedRow.recipients && selectedRow.recipients.length > 0 ? (
                    <div className={styles.recipientTable}>
                      {/* Header */}
                      <div className={styles.recipientHeader}>
                        {Object.keys(selectedRow.recipients[0]).map((key) => (
                          <span key={key} className={styles.recipientHeaderCell}>
                            {key}
                          </span>
                        ))}
                      </div>

                      {/* Rows */}
                      {selectedRow.recipients.map((recipient, index) => (
                        <div key={index} className={styles.recipientRow}>
                          {Object.values(recipient).map((value, valueIndex) => (
                            <span key={valueIndex} className={styles.recipientCell}>
                              {value || "-"}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default DocumentSign;
