'use client';
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const ToastWrapper = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return <ToastContainer position="top-center" autoClose={3000} />;
};

export default ToastWrapper;
