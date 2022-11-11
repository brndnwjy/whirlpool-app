import React from "react";
import { Link } from "react-router-dom";
import styles from "../auth.module.css";

const Register = () => {
  return (
    <main className={styles.main}>
      <div className={`col-12 col-md-5 py-3 ${styles["auth-card"]}`}>
        <h3 className={`mb-3 ${styles.title}`}>Register</h3>
        <p className="col-10 text-left">Let's create your account!</p>
        <form className="col-10 d-flex flex-column">
          <div className="form-floating mb-3">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="form-control"
            />
            <label htmlFor="name" className={styles.label}>Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
            />
            <label htmlFor="email" className={styles.label}>Email</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              className="form-control"
            />
            <label htmlFor="phone" className={styles.label}>Phone</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
            />
            <label htmlFor="password" className={styles.label}>Password</label>
          </div>

          <button type="button" className={`mb-2 ${styles["btn-green"]}`}>
            Register
          </button>

          <div className={styles.options}>
            <h6>
              <span>Register with</span>
            </h6>
          </div>

          <button type="button" className={`mb-3 ${styles["btn-white"]}`}>
            Google
          </button>

          <small className="text-center">
            Already have an account?
            <Link to="/login" className={`m-1 ${styles.link}`}>
              Login here
            </Link>
          </small>
        </form>
      </div>
    </main>
  );
};

export default Register;
