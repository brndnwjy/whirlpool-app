import React from "react";
import { Link } from "react-router-dom";
import styles from "../auth.module.css";

const Login = () => {
  return (
    <main className={styles.main}>
      <div className={`col-12 col-md-5 ${styles["auth-card"]}`}>
        <h3 className={`mb-3 ${styles.title}`}>Login</h3>
        <p className="col-10 text-left">Hi, welcome back!</p>
        <form className="col-10 d-flex flex-column">
          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
            />
            <label htmlFor="password">Password</label>
          </div>

          <small className="mb-3 text-end">
            <Link to="/forgot" className={styles.link}>
              Forgot password?
            </Link>
          </small>

          <button type="button" className={`mb-2 ${styles["btn-green"]}`}>
            Login
          </button>

          <div className={styles.options}>
            <h6>
              <span>Login with</span>
            </h6>
          </div>

          <button type="button" className={`mb-3 ${styles["btn-white"]}`}>
            Google
          </button>

          <small className="text-center">
            Don't have an account?
            <Link to="/forgot" className={`m-1 ${styles.link}`}>
              Register here
            </Link>
          </small>
        </form>
      </div>
    </main>
  );
};

export default Login;
