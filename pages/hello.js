import Link from "next/link"
import styles from '../styles/Hello.module.css'

export default function Hello() {
  return (
    <div className={styles.container}>
      <Link href={'/'}>Go to home</Link>
    </div>
  )
}
