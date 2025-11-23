"use client";

import React from 'react';
import { ChatAssistant } from '@/components/ChatAssistant';

const AssistantPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-128px)] flex items-center justify-center">
      <ChatAssistant />
    </div>
  );
};

export default AssistantPage;