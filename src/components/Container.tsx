import styles from "./Container.module.css";

export type ContainerVariant = "narrow" | "content" | "wide" | "modal";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = "content",
  children,
  className,
  ...rest
}) => {
  const variantClass = styles[variant];
  const combinedClassName = [styles.container, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName} {...rest}>
      {children}
    </div>
  );
};