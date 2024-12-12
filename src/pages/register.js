import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layouts from '../components/layouts';
import Navbar from '../components/navbar'; // Mengimpor Navbar
import styles from "../styles/Register.module.css";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    nik: "",
    phone: "",
    unit_pln_id: 0,
    jenis_user: "internal",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const router = useRouter();
  const [unitPlnOptions, setUnitPlnOptions] = useState([]); // Store the options for the select
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const fetchUnitPlnOptions = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${apiBaseUrl}/api/data/unit-pln`,
          headers: {
            Authorization: `Bearer ${authToken}`,          }
        };
        const response = await axios.request(config);
        // Cek jika response.data.data adalah array
        if (Array.isArray(response.data.data)) {
          setUnitPlnOptions(response.data.data); // Mengambil data dari response
          console.log(response.data.data); // Cek data yang diambil
        } else {
          console.error("Unexpected response structure:", response.data);
          setUnitPlnOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch Unit PLN options:", error);
        setUnitPlnOptions([]);
      }
    };

    fetchUnitPlnOptions();
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^(?:\+62|62|0)8\d{8,11}$/;
    return phoneRegex.test(phone);
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Validation logic
    if (name === 'name') {
      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "*Nama Lengkap tidak boleh kosong",
        }));
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "*Nama Lengkap hanya boleh mengandung huruf dan spasi",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
      }
    }

    if (name === 'nik' && !/^\d{16}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nik: '*NIK harus berupa angka dengan 16 digit',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, nik: "" }));
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '*Please enter a valid email address',
        }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (name === 'phone') {
      if (!validatePhone(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: '*Please enter a valid phone number',
        }));
      } else {
        setErrors((prevErrors) => {
          const { phone, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (name === 'dob') {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: "*Tanggal lahir harus diisi",
        }));
      } else if (new Date(value) > new Date()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: "*Tanggal lahir tidak boleh melebihi masa sekarang",
        }));
      } else {
        // Hapus error jika tanggal valid
        setErrors((prevErrors) => ({
          ...prevErrors,
          dob: null, // Atau bisa juga dihapus dengan tidak menyertakannya
        }));
      }
      // else {
      //   setErrors((prevErrors) => ({ ...prevErrors, dob: "" }));
      //   const [year, month, day] = value.split("-");
      //   const formattedDate = `${day}-${month}-${year}`;
      //   setForm((prevForm) => ({ ...prevForm, dob: formattedDate }));
      // }
    }

    /*if (name === 'unit_pln_id') {
      const selectedValue = value ? Number(value) : 0; // Convert value to a number
      setForm((prevForm) => ({
        ...prevForm,
        unit_pln_id: selectedValue,
      }));
    
      // Validation logic
      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          unit_pln_id: "*Unit PLN Id harus diisi",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, unit_pln_id: "" }));
      }
    }

    if (name === 'jenis_user') {
      if (value === "eksternal") {
        setForm((prevForm) => ({ ...prevForm, unit_pln: "" }));
      }
    }*/

      if (name === "jenis_user") {
        setForm((prevForm) => ({
          ...prevForm,
          jenis_user: value,
          unit_pln: value === "eksternal" ? "" : prevForm.unit_pln, // Reset unit_pln for external
          unit_pln_id: value === "eksternal" ? 999 : 0, // Set unit_pln_id to 999 for external, reset for internal
        }));
    
        // Clear validation error for 'unit_pln_id' if external
        if (value === "eksternal") {
          setErrors((prevErrors) => ({ ...prevErrors, unit_pln_id: "" }));
        }
      }
    
      // Handle 'unit_pln_id'
      if (name === "unit_pln_id") {
        const selectedValue = value ? Number(value) : 0; 
        setForm((prevForm) => ({
          ...prevForm,
          unit_pln_id: selectedValue,
        }));
    
        // Validation logic
        if (!value.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            unit_pln_id: "*Unit PLN Id harus diisi",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, unit_pln_id: "" }));
        }
      }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonData = JSON.stringify(form);

    // const formData = new FormData();
    // for (const key in form) {
    //   formData.append(key, form[key]);
    // }

    try {
      setLoading(true);

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${apiBaseUrl}/api/register-signer`,
        jsonData,
        {
          headers: {
            apikey: "QFW8Vl9jpuHEe47llqTuwkvQQRcfLnvh",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAlertMessage("Registration successful!");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Registration failed. Please try again.");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };


  // Effect untuk pengecekan session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiryTime = localStorage.getItem("expiryTime");
    const hasAttemptedLogin = localStorage.getItem("hasAttemptedLogin");

    if (!token || !expiryTime || new Date().getTime() > Number(expiryTime)) {
      if (hasAttemptedLogin) {
        setAlertMessage("Session expired. Please log in again.");
        setAlertType("session-expired");
        setShowAlert(true);
        setRedirectToLogin(false);
      } else {
        localStorage.setItem("hasAttemptedLogin", "true");
        setRedirectToLogin(true);
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiryTime");
      localStorage.removeItem("hasAttemptedLogin");
    } else {
      localStorage.setItem("hasAttemptedLogin", "true");
    }
  }, [router]);

  useEffect(() => {
    if (redirectToLogin && !showAlert) {
      router.push("/login");
    }
  }, [redirectToLogin, showAlert, router]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      setForm({
        name: "",
        email: "",
        dob: "",
        nik: "",
        phone: "",
        unit_pln: "",
        jenis_user: "",
      });
    }
  };

  return (
    <Layouts>
      <Navbar></Navbar>
    <div className={styles.container}>
      <div className={styles.card}>
      <h2 className={styles.title}>Hello! Welcome to PLN Sign</h2>
      <p className={styles.minititle}>Create an account with PLN Sign</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.inputContainer}>
            <label htmlFor="name" className={styles.label}>Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Isi Nama Lengkap"
              className={styles.input}
              onChange={handleChange}
              value={form.name}
              disabled={loading}
              required
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Isi Email"
              className={styles.input}
              onChange={handleChange}
              value={form.email}
              disabled={loading}
              required
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="phone" className={styles.label}>Nomor Telepon</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Isi Nomor Telepon"
              className={styles.input}
              onChange={handleChange}
              value={form.phone}
              disabled={loading}
              required
            />
            {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputContainer}>
            <label htmlFor="dob" className={styles.label}>Tanggal Lahir</label>
            <input
              id="dob"
              name="dob"
              type="date"
              placeholder="Tanggal Lahir"
              className={styles.input}
              onChange={handleChange}
              value={form.dob}
              disabled={loading}
              required
            />
            {errors.dob && <p className={styles.errorMessage}>{errors.dob}</p>}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="nik" className={styles.label}>Nomor KTP</label>
            <input
              id="nik"
              name="nik"
              type="text"
              placeholder="Isi Nomor KTP"
              className={styles.input}
              onChange={handleChange}
              value={form.nik}
              disabled={loading}
              required
            />
            {errors.nik && <p className={styles.errorMessage}>{errors.nik}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputContainer}>
            <label htmlFor="jenis_user" className={styles.label}>Jenis User</label>
            <select
              id="jenis_user"
              name="jenis_user"
              className={styles.input}
              onChange={handleChange}
              value={form.jenis_user}
              disabled={loading}
              required
            >
              <option value="" disabled>Pilih Jenis User</option>
              <option value="internal">Internal</option>
              <option value="eksternal">Eksternal</option>
            </select>
          </div>

          {form.jenis_user === "internal" && (
            <div className={styles.inputContainer}>
              <label htmlFor="unit_pln_id" className={styles.label}>Unit PLN</label>
              <select
                id="unit_pln_id"
                name="unit_pln_id"
                className={styles.input}
                onChange={handleChange}
                disabled={loading}
                value={form.unit_pln_id}
                required
              >
                <option value="">Pilih Unit PLN</option>
                {unitPlnOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.nama}</option>
                ))}
              </select>
              {errors.unit_pln && <p className={styles.errorMessage}>{errors.unit_pln}</p>}
            </div>
          )}
        </div>

        <div className={styles.row}>
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>

      {showAlert && (
        <div className={styles.alertContainer}>
          <div className={`${styles.alertCard} ${alertType === "success" ? styles.success : alertType === "error" ? styles.error : styles.sessionExpired}`}>
            <p>{alertMessage}</p>
            <button className={styles.alertButton} onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
      </div>
    </div>
    </Layouts>
  );
};
