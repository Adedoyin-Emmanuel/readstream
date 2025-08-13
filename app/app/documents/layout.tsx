import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
  description: "Documents",
};

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default DocumentLayout;
