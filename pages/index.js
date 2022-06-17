import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const navItems = [...Array(6)].map((_, key) => ['Item ' + (key + 1)]);

export default function Home() {
  const [activeItem, setActiveItem] = useState(null);
  const prevActiveItem = usePrevious(activeItem);
  const [dropdownTransform, setDropdownTransform] = useState('');
  const dropdownRef = useRef(null);

  const callbackArg = activeItem || prevActiveItem;

  const getDropdownTransform = useCallback(() => {
    const { top, left } = callbackArg.getBoundingClientRect();
    const x = left - 10;
    const y = top + callbackArg.clientHeight + 2;
    setDropdownTransform(`translate3d(${x}px, ${y}px, 0px)`);
  }, [callbackArg]);

  const handleOutSideClick = useCallback(({ target }) => {
    if (!dropdownRef.current.contains(target) && !callbackArg.contains(target)) {
      setActiveItem(null);
    }
  }, [dropdownRef, callbackArg]);

  const onClickHandler = ({ target }) => {
    if (activeItem) {
      setActiveItem(null);
    } else {
      setDropdownTransform('');
      setActiveItem(target);
    }
  };

  useEffect(() => {
    if (activeItem) {
      getDropdownTransform(activeItem);
      document.addEventListener('scroll', getDropdownTransform, true);
      document.addEventListener('resize', getDropdownTransform, true);
      document.addEventListener('mousedown', handleOutSideClick, true);
    } else {
      document.removeEventListener('scroll', getDropdownTransform, true);
      document.removeEventListener('resize', getDropdownTransform, true);
      document.removeEventListener('mousedown', handleOutSideClick, true);
    }
    return () => {
      document.removeEventListener('scroll', getDropdownTransform, true);
      document.removeEventListener('resize', getDropdownTransform, true);
      document.removeEventListener('mousedown', handleOutSideClick, true);
    }
  }, [activeItem]);

  return (
    <div>

      {
        activeItem && dropdownTransform ?
          <div className={styles.dropdown} style={{ transform: dropdownTransform }} ref={dropdownRef} />
          : null
      }

      <div className={styles.link}>
        <Link href={'/hello'}>Go to hello</Link>
      </div>

      <div className={styles.navWrapper}>
        <div className={styles.nav}>
          {
            navItems.map(item =>
              <div key={item} className={styles.navItem} onClick={onClickHandler}>
                {item}
              </div>
            )
          }
        </div>
      </div>

      <div className={styles.content}>
        <h1>CONTENT</h1>
      </div>

    </div>
  )
}
