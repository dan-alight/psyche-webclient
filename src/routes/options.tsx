import { Outlet, Link, createFileRoute } from "@tanstack/react-router";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import styles from "./options.module.css";
import linkStyles from "@/styles/links.module.css";
export const Route = createFileRoute("/options")({
  component: Options,
});

function Options() {
  return (
    <div className={styles.optionsContainer}>
      <SecondaryNavbar>
        <Link
          to="/options"
          className={linkStyles.link}
          activeProps={{ "data-status": "active" }}
        >
          Providers
        </Link>
      </SecondaryNavbar>
      <div className={styles.outletContainer}>
        <Outlet />
      </div>
    </div>
  );
}
