import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";

const Messages = () => {
  return <Container maxWidth="xl">Messages</Container>;
};

Messages.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);
export default Messages;
