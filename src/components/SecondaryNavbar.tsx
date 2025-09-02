import styles from "./SecondaryNavbar.module.css";

export default function SecondaryNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className={styles.secondaryNavbar}>{children}</div>;
}