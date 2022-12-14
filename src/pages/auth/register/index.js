import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "../auth.module.css";
import { register } from "../../../redux/action/user.action";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerForm, setRegisterForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInput = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(register(registerForm, navigate));
  };
  return (
    <main className={styles.main}>
      <div className={`col-12 col-md-5 py-3 ${styles["auth-card"]}`}>
        <h3 className={`mb-3 ${styles.title}`}>Register</h3>
        <p className="col-10 text-left">Let's create your account!</p>
        <form onSubmit={handleSubmit} className="col-10 d-flex flex-column">
          <div className="form-floating mb-3">
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Name"
              className="form-control"
              value={registerForm.fullname}
              onChange={handleInput}
            />
            <label htmlFor="fullname" className={styles.label}>
              Name
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
              value={registerForm.email}
              onChange={handleInput}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              className="form-control"
              value={registerForm.phone}
              onChange={handleInput}
            />
            <label htmlFor="phone" className={styles.label}>
              Phone
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              value={registerForm.password}
              onChange={handleInput}
            />
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
          </div>

          <button type="submit" className={`mb-2 ${styles["btn-green"]}`}>
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
