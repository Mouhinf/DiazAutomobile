"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAIResponseFromAPI } from '@/lib/gemini'; // Import de la nouvelle fonction

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Bonjour 👋 ! Je suis votre conseiller parking, disponible 24h/24 pour vous aider à trouver la voiture idéale. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      const newUserMessage: Message = { sender: 'user', text: input.trim() };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput('');
      setIsThinking(true);

      // Appel de la nouvelle fonction qui utilise l'API REST directe
      const aiResponseText = await getAIResponseFromAPI(newUserMessage.text);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
      setIsThinking(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[70vh] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" /> Assistant IA Diaz Automobile
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">IA</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">IA</AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">L'IA réfléchit...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isThinking}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isThinking}>
            {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Envoyer</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};