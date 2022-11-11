import React from "react";
import styles from "../auth.module.css";

const Forgot = () => {
  return (
    <main className={styles.main}>
      <div className={`col-12 col-md-5 ${styles["auth-card"]} ${styles["forgot-card"]}`}>
        <h3 className={`mb-3 ${styles.title}`}>Forgot Password</h3>
        <p className="col-10 text-left">
          You'll get message soon on your email!
        </p>
        <form className="col-10 d-flex flex-column">
          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
          </div>

          <button type="button" className={`mb-2 ${styles["btn-green"]}`}>
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default Forgot;
