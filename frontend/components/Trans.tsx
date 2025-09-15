//app/components/Trans.tsx

// components/Trans.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/app/context/TranslationContext";

type TransProps = {
  children: string; // text to translate
};

export default function Trans({ children }: TransProps) {
  const { translate } = useTranslation();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const t = await translate(children);
      if (isMounted) setTranslated(t);
    })();

    return () => {
      isMounted = false; // cancel if component unmounts
    };
  }, [children, translate]);

  return <>{translated}</>;
}
