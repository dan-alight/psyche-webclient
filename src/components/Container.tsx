import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils"; // Assuming you created this
import type { Theme } from "@emotion/react";

// Define the possible size variants based on our theme's keys
type ContainerVariant = keyof Theme["containerWidths"];

// Define component props. We also accept any standard div props.
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = "content",
  children,
  ...rest
}) => {
  const theme = useTheme();

  // Create the styles using the css function
  const containerStyles = {
    width: "100%",
    margin: "0 auto",
    maxWidth: pxToRem(theme.containerWidths[variant]),
  };

  return (
    <div css={containerStyles} {...rest}>
      {children}
    </div>
  );
};
