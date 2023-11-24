import React, { useState, useEffect } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container, TextField, Button } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import axios from "axios";

const Messages = () => {
  return (
    <Container maxWidth="xl">
        <p>Welcome to the AI Assistant!</p>
      <h1>AI Assistant</h1>
    </Container>
  );
};

Messages.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default Messages;
