import { useTheme } from "@emotion/react";
export default function Provider() {
  const theme = useTheme();
  return (
    <div
      css={
        {
          //padding: `${theme.spacing.sm}rem`,
        }
      }
    >
      <h2>Provider Options</h2>
      <p>Select your AI provider.</p>
      {/* Additional content can be added here */}
    </div>
  );
}
