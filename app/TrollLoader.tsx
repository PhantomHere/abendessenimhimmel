'use client';

import { useEffect } from "react";

export default function TrollLoader() {
  useEffect(() => {
    fetch('/dbPrivateAccessKey.js').catch(() => {});
  }, []);

  return null;
}