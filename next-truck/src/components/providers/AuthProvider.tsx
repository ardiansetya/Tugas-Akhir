"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const AuthProvider = (props: PropsWithChildren) => {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
    }else{
      router.replace("/");
    }
  }, []);

  return props.children;
};

export default AuthProvider;
