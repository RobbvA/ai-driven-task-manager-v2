"use client";

import { Box, VStack, IconButton } from "@chakra-ui/react";
import { FiHome, FiList, FiSettings, FiUser, FiBell } from "react-icons/fi";

const navItems = [
  { id: "home", icon: FiHome, active: true },
  { id: "tasks", icon: FiList, active: false },
  { id: "notifications", icon: FiBell, active: false },
  { id: "profile", icon: FiUser, active: false },
  { id: "settings", icon: FiSettings, active: false },
];

export default function Sidebar() {
  return (
    <Box
      w="72px"
      bg="#f0f2fa" // cooler light-gray
      minH="100vh"
      borderRight="1px solid #d5d8e4"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      left={0}
      top={0}
      py={6}
      zIndex={20}
    >
      <VStack spacing={4}>
        {navItems.map((item) => (
          <NavIcon key={item.id} icon={item.icon} active={item.active} />
        ))}
      </VStack>
    </Box>
  );
}

function NavIcon({ icon, active }) {
  return (
    <Box position="relative">
      {active && (
        <Box
          position="absolute"
          left="-12px"
          top="50%"
          transform="translateY(-50%)"
          w="3px"
          h="24px"
          borderRadius="full"
          bg="#b5baff" // pastel tech blue
        />
      )}

      <IconButton
        aria-label="Navigation icon"
        icon={icon({ size: 20 })}
        variant="ghost"
        size="sm"
        color={active ? "#3b3f5c" : "gray.500"}
        _hover={{ bg: "#e2e6ff", color: "#1e2235" }} // subtle tech blue hover
        _active={{ bg: "#dbe0ff" }}
      />
    </Box>
  );
}
