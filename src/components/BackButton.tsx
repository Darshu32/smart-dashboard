// src/components/BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // you can use any icon or plain text

const BackButton = ({ to = "/dashboard" }: { to?: string }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center text-pink-600 hover:text-pink-800 font-bold mb-"
    >
      <ArrowLeft className="mr-1" size={50} />
      
    </button>
  );
};4

export default BackButton;
