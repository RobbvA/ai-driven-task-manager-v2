"use client";

import { Box, VStack, IconButton } from "@chakra-ui/react";
import { FiHome, FiList, FiSettings, FiUser, FiBell } from "react-icons/fi";

export default function Sidebar() {
  return (
    <Box
      w="60px"
      bg="#0B0D14"
      minH="100vh"
      borderRight="1px solid #1B1D23"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      left={0}
      top={0}
      py={6}
    >
      <VStack spacing={6}>
        <NavIcon icon={FiHome} />
        <NavIcon icon={FiList} />
        <NavIcon icon={FiBell} />
        <NavIcon icon={FiUser} />
        <NavIcon icon={FiSettings} />
      </VStack>
    </Box>
  );
}

function NavIcon({ icon }) {
  return (
    <IconButton
      icon={icon({ size: 20 })}
      variant="ghost"
      color="gray.300"
      _hover={{ bg: "#1A1C22" }}
    />
  );
}
