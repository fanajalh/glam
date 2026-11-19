"use client";

import React, { createContext, useContext } from "react";
import {
  DEFAULT_SITE_CONTENT,
  type SiteContentConfig,
} from "@/lib/site-content-types";

const SiteContentContext = createContext<SiteContentConfig>(DEFAULT_SITE_CONTENT);

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContentConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentConfig {
  return useContext(SiteContentContext);
}

