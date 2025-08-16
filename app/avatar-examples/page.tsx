"use client";

import React from "react";
import UserAvatar from "@/components/ui/UserAvatar";

export default function AvatarExamples() {
  // Define avatar size examples
  const sizeExamples = [
    { size: "xs", label: "xs", img: 1 },
    { size: "sm", label: "sm", img: 2 },
    { size: "md", label: "md (default)", img: 3 },
    { size: "lg", label: "lg", img: 4 },
    { size: "xl", label: "xl", img: 5 },
  ];

  // Define fallback examples
  const fallbackExamples = [
    { firstName: "John", lastName: "Doe", name: "John Doe" },
    { firstName: "Alice", lastName: "Smith", name: "Alice Smith" },
    { firstName: "Robert", lastName: "Johnson", name: "Robert Johnson" },
    {
      firstName: "Tim",
      lastName: "Franklin",
      name: "Tim Franklin",
      size: "lg",
    },
  ];

  // Define custom fallback styles examples
  const styleExamples = [
    {
      firstName: "John",
      lastName: "Doe",
      label: "Blue",
      fallbackClassName: "bg-blue-600 text-white",
    },
    {
      firstName: "Alice",
      lastName: "Smith",
      label: "Green",
      fallbackClassName: "bg-green-100 text-green-700",
    },
    {
      firstName: "Robert",
      lastName: "Johnson",
      label: "Purple",
      fallbackClassName: "bg-purple-100 text-purple-700",
    },
    {
      firstName: "Tim",
      lastName: "Franklin",
      label: "Gradient",
      fallbackClassName:
        "bg-gradient-to-r from-pink-500 to-orange-500 text-white",
      size: "lg",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">
        User Avatar Component Examples
      </h1>

      <div className="space-y-12">
        {/* Different sizes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Avatar Sizes</h2>
          <div className="flex items-end gap-6">
            {sizeExamples.map((example, index) => (
              <div key={index} className="flex flex-col items-center">
                <UserAvatar
                  size={example.size as "xs" | "sm" | "md" | "lg" | "xl"}
                  src={`https://i.pravatar.cc/300?img=${example.img}`}
                />
                <span className="mt-2 text-sm text-gray-500">
                  {example.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Fallback initials */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Fallback Initials</h2>
          <div className="flex gap-6">
            {fallbackExamples.map((example, index) => (
              <div key={index} className="flex flex-col items-center">
                <UserAvatar
                  firstName={example.firstName}
                  lastName={example.lastName}
                  size={
                    example.size as "xs" | "sm" | "md" | "lg" | "xl" | undefined
                  }
                />
                <span className="mt-2 text-sm text-gray-500">
                  {example.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Custom fallback styles */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Custom Fallback Styles</h2>
          <div className="flex gap-6">
            {styleExamples.map((example, index) => (
              <div key={index} className="flex flex-col items-center">
                <UserAvatar
                  firstName={example.firstName}
                  lastName={example.lastName}
                  fallbackClassName={example.fallbackClassName}
                  size={
                    example.size as "xs" | "sm" | "md" | "lg" | "xl" | undefined
                  }
                />
                <span className="mt-2 text-sm text-gray-500">
                  {example.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Avatar in context */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Avatars in Context</h2>

          {/* User card */}
          <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm max-w-md">
            <div className="flex items-center">
              <UserAvatar
                src="https://i.pravatar.cc/300?img=10"
                firstName="Jane"
                lastName="Wilson"
                size="lg"
              />
              <div className="ml-4">
                <h3 className="font-medium">Jane Wilson</h3>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
            </div>
          </div>

          {/* Comment section */}
          <div className="max-w-md border rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Comments</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                {
                  avatar: {
                    src: "https://i.pravatar.cc/300?img=11",
                    firstName: "Michael",
                    lastName: "Brown",
                  },
                  author: "Michael Brown",
                  time: "2 hours ago",
                  content:
                    "Great work on the latest update! The new features are exactly what we needed.",
                },
                {
                  avatar: {
                    firstName: "Sarah",
                    lastName: "Lee",
                  },
                  author: "Sarah Lee",
                  time: "1 hour ago",
                  content: "I agree. The interface is much more intuitive now.",
                },
              ].map((comment, index) => (
                <div key={index} className="flex">
                  <UserAvatar
                    src={comment.avatar.src}
                    firstName={comment.avatar.firstName}
                    lastName={comment.avatar.lastName}
                    size="sm"
                  />
                  <div className="ml-3 bg-gray-100 p-3 rounded-lg flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex">
              <UserAvatar firstName="Your" lastName="Name" size="sm" />
              <input
                type="text"
                placeholder="Write a comment..."
                className="ml-3 flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
