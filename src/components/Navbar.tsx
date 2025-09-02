import { Link } from "@tanstack/react-router";
import styles from "./Navbar.module.css";
import linkStyles from "@/styles/links.module.css";

export default function Navbar() {
  const outboundLinks = [
    { path: "/chat", label: "Chat" },
    { path: "/journal", label: "Journal" },
    { path: "/options", label: "Options" },
  ];
  return (
    <div className={styles.navbar}>
      {outboundLinks.map((link, i) => (
        <Link
          key={i}
          to={link.path}
          className={linkStyles.link}
          activeProps={{ "data-status": "active" }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
