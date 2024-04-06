import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
  }, []);

  const addEventListeners = () => {
    document.addEventListener("mousemove", onMouseMove);
  };

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = (e: any) => {
    setPosition({ x: e.pageX, y: e.pageY });
  };

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={styles.cursor}
      ></div>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={styles.cursor_follower}
      ></div>
    </div>
  );
};

export default Cursor;
