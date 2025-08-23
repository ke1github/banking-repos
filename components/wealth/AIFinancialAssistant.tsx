"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/custom-badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sparkles, Send, ExternalLink, RefreshCw } from "lucide-react";
import { aiWealthService } from "@/lib/api/aiWealthService";
import { AIChatMessage, WealthInsight } from "@/lib/types/ai-wealth-types";

export default function AIFinancialAssistant() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm your AI financial assistant. I can help you with investment advice, portfolio analysis, financial planning, and more. What would you like to know about your finances today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    // Add user message to chat
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Get AI response
      const aiResponse = await aiWealthService.sendFinancialAssistantMessage(
        "mock-user-id",
        inputValue
      );

      // Add AI response to chat
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
      <Card className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/icons/ai-assistant.png" alt="AI" />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">AI Financial Assistant</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {/* Related insights */}
                  {message.relatedInsights &&
                    message.relatedInsights.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium mb-1">
                          {message.role === "user"
                            ? "Related to:"
                            : "Related Insights:"}
                        </div>
                        {message.relatedInsights.map(
                          (insight: WealthInsight) => (
                            <div
                              key={insight.id}
                              className={`text-xs p-2 rounded ${
                                message.role === "user"
                                  ? "bg-blue-600"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <div className="font-medium">{insight.title}</div>
                              <div className="line-clamp-2">
                                {insight.description}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* Action buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={
                            message.role === "user" ? "secondary" : "outline"
                          }
                          className={
                            message.role === "user" ? "bg-blue-600" : ""
                          }
                        >
                          {action.label}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="text-right mt-1">
                    <span
                      className={`text-[10px] ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-3 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask about your finances, investments, or financial goals..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            <span>
              Powered by AI. Ask about your portfolio, investments, goals, or
              financial advice.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
