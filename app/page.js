"use client";

import { Box, Heading } from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";

export default function HomePage() {
  return (
    <Box minH="100vh" bg="#050509" color="white">
      <Topbar />

      <Box as="main" px={6} py={6}>
        <Heading size="lg" mb={6}>
          Tasks overview
        </Heading>

        <TaskTable />
      </Box>
    </Box>
  );
}
