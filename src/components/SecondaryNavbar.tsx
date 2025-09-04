import styles from "./SecondaryNavbar.module.scss";

export default function SecondaryNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className={styles.secondaryNavbar}>{children}</div>;
}