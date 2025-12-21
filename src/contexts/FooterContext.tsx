import React from "react";

interface FooterContextType {
  setContent: ((content: React.ReactNode) => void) | null;
}

const FooterContext = React.createContext<FooterContextType>({
  setContent: null,
});

export function useFooter() {
  return React.useContext(FooterContext);
}

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<React.ReactNode>(null);

  return (
    <FooterContext.Provider value={{ setContent }}>
      {children}
      {content && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4">
          {content}
        </div>
      )}
    </FooterContext.Provider>
  );
}
