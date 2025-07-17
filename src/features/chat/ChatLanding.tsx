import { useState, useEffect, useRef, useMemo } from "react";
import { css, useTheme } from "@emotion/react";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import { pxToRem } from "@/utils";
import { useControlPanel } from "@/contexts/ControlPanelContext";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import ControlPanel from "@/app/ControlPanel";
import type { ConversationRead } from "@/types/api";

export default function ChatLanding() {
  useEffect(() => {}, []);

  return (
    <div
      css={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      chat landing
    </div>
  );
}
