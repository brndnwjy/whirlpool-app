import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../auth.module.css";
import io from "socket.io-client";
import swal from "sweetalert";

const Login = ({ setSocket }) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch()

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`https://whirlpool-arx.up.railway.app/v1/user/login`, loginForm)
      .then((res) => {
        const token = res.data.data.token;
        const user = {
          id: res.data.data.user_id,
          name: res.data.data.fullname,
          email: res.data.data.email,
          phone: res.data.data.phone,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        const socket = io(`https://whirlpool-arx.up.railway.app`, {
          query: {
            token: token,
          },
        });
        setSocket(socket);
        swal({
          title: "Logged In",
          text: `Welcome, ${user.name}`,
          icon: "success",
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
    // dispatch(login(setSocket, loginForm, navigate))
  };

  return (
    <main className={styles.main}>
      <div className={`col-12 col-md-5 ${styles["auth-card"]}`}>
        <h3 className={`mb-3 ${styles.title}`}>Login</h3>
        <p className="col-10 text-left">Hi, welcome back!</p>
        <form onSubmit={handleSubmit} className="col-10 d-flex flex-column">
          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
              value={loginForm.email}
              onChange={handleInput}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              value={loginForm.password}
              onChange={handleInput}
            />
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
          </div>

          <small className="mb-3 text-end">
            <Link to="/forgot" className={styles.link}>
              Forgot password?
            </Link>
          </small>

          <button type="submit" className={`mb-2 ${styles["btn-green"]}`}>
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
            <Link to="/register" className={`m-1 ${styles.link}`}>
              Register here
            </Link>
          </small>
        </form>
      </div>
    </main>
  );
};

export default Login;
