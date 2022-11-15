import React from "react";
import styles from "./main.module.css";

const Main = () => {
  return (
    <body className={styles.body}>
      <aside className={`col-4 ${styles.sidemenu}`}>
        <div>
          <h2>Whirlpool</h2>
        </div>

        <searchbar />

        <div>{/* bubbles */}</div>

        <div>{/* preview chat */}</div>
      </aside>
      <main className={`col-8 ${styles.main}`}></main>
    </body>
  );
};

export default Main;
