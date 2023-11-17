import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container, TextField, Button } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import axios from "axios";

// Styled components
const WelcomeSection = styled.div`
  padding: 20px;
`;

const ResponseSection = styled.div`
  margin-top: 20px;
  padding: 10px;
`;

const Messages = () => {
  const [messageInput, setMessageInput] = useState("");
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const API_KEY = "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";

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt: messageInput,
          max_tokens: 1024,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      const chatGPTResponseText = response.data.choices[0].text;
      setChatGPTResponse(chatGPTResponseText);
      setMessageInput("");
    } catch (error) {
      console.error("ChatGPT error:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <WelcomeSection>
        <p>Welcome to the AI Assistant!</p>
        <p>
          This is a simple chatbot that can help you with any question or
          problem. THIS IS NOT TO BE USED FOR DIAGNOSIS OR PRESCRIPTIONS
        </p>
      </WelcomeSection>

      <h1>AI Assistant</h1>
      <TextField
        id="messageInput"
        label="Your Message"
        value={messageInput}
        onChange={(event) => setMessageInput(event.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={sendMessage}>
        Send
      </Button>
      <ResponseSection>
        <p>Response:</p>
        <p>{chatGPTResponse}</p>
      </ResponseSection>
    </Container>
  );
};

Messages.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default Messages;
