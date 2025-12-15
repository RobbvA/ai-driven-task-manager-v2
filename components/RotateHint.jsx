"use client";

import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

export default function RotateHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShow(isMobile && isPortrait);
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  if (!show) return null;

  return (
    <Box
      position="fixed"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      px={4}
      py={2}
      bg="rgba(31,35,53,0.92)"
      color="white"
      fontSize="xs"
      borderRadius="full"
      boxShadow="0 10px 25px rgba(0,0,0,0.25)"
      zIndex={1000}
    >
      <Text whiteSpace="nowrap">
        For the best experience, rotate your device
      </Text>
    </Box>
  );
}
