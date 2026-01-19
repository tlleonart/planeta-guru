/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Content is sanitized with sanitizeHtml before rendering */
import type { FC } from "react";
import { sanitizeHtml } from "@/modules/shared/lib/sanitize";
import { cn } from "@/modules/shared/lib/utils";

export interface ListedDescriptionProps {
  size?: "medium" | "large";
  textStyling?: string;
  listStyling?: string;
  type: "bullets" | "instructions";
  description: string[];
}

/**
 * Server Component: Lista de descripciones con formato
 * - Soporta listas de bullets o numeradas (instrucciones)
 * - Tamaños configurables (medium/large)
 * - Renderiza HTML seguro con dangerouslySetInnerHTML para specs con formato
 */
export const ListedDescription: FC<ListedDescriptionProps> = ({
  size = "medium",
  listStyling = "",
  textStyling = "",
  type,
  description,
}) => {
  return (
    <div
      className={cn(
        size === "medium" && "pb-4 md:pb-0 px-4 md:px-6",
        size === "large" && "px-6",
      )}
    >
      <ul
        className={cn(
          "flex flex-col",
          size === "medium" && "gap-1",
          size === "large" && "gap-2",
          type === "bullets" && "list-disc",
          type === "instructions" && "list-decimal",
          listStyling,
        )}
        style={
          type === "bullets"
            ? { listStyleType: "disc" }
            : { listStyleType: "decimal" }
        }
      >
        {description.map((item, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: Static description items from product data
            key={index}
            className={cn(
              "text-left",
              size === "medium" && "text-sm md:text-base",
              size === "large" && "text-base md:text-lg",
              textStyling,
            )}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }}
          />
        ))}
      </ul>
    </div>
  );
};
