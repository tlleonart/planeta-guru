"use client";

import { useLocale, useTranslations } from "next-intl";
import type { FC, ReactNode } from "react";
import { FaFacebookF, FaRegCopy, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog";

export interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productType: string;
  productSlug: string;
}

interface ShareMethod {
  name: string;
  url?: string;
  icon: ReactNode;
  onClick?: () => void;
}

/**
 * Client Component: Modal de compartir producto optimizado
 * - i18n con next-intl
 * - URLs dinámicas basadas en locale y producto
 * - Iconos de redes sociales
 * - Clipboard API para copiar
 */
export const ShareModal: FC<ShareModalProps> = ({
  isOpen,
  onOpenChange,
  productType,
  productSlug,
}) => {
  const t = useTranslations("ShareModal");
  const locale = useLocale();

  // Construir URL del producto
  const getProductUrl = (): string => {
    if (typeof window === "undefined") return "";

    const baseURL = window.location.origin;
    const parsedType = productType.toLowerCase().replace(/\s+/g, "-");
    const slug = productSlug.startsWith("/") ? productSlug : `/${productSlug}`;
    return `${baseURL}/${locale}/products/${parsedType}${slug}`;
  };

  const productUrl = getProductUrl();
  const text = t("shareText");
  const hashtag = "planetaguru";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      // TODO: Replace with toast notification
    } catch {
      // Clipboard API failed - user needs to manually copy
    }
  };

  const shareMethods: ShareMethod[] = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        productUrl,
      )}&hashtags=${hashtag}&text=${encodeURIComponent(text)}`,
      icon: <FaTwitter size={32} />,
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${text} ${productUrl}`,
      )}`,
      icon: <FaWhatsapp size={32} />,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl,
      )}`,
      icon: <FaFacebookF size={32} />,
    },
    {
      name: "Copy",
      icon: <FaRegCopy size={28} />,
      onClick: copyToClipboard,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-fit sm:max-w-lg border-none p-5 md:p-10 text-foreground rounded-none">
        <DialogHeader className="w-full flex flex-col text-center p-4">
          <DialogTitle className="w-full text-center text-xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="w-full text-center">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-around gap-3">
          {shareMethods.map((method) =>
            method.url ? (
              <a
                key={method.name}
                href={method.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center cursor-pointer w-14 h-14 rounded-full transition-colors duration-300 ease-in-out p-3 hover:bg-main bg-white border-2 hover:border-slate-200 border-main hover:text-white text-main"
                aria-label={`Share on ${method.name}`}
              >
                {method.icon}
              </a>
            ) : (
              <button
                key={method.name}
                type="button"
                onClick={method.onClick}
                className="flex items-center justify-center cursor-pointer w-14 h-14 rounded-full transition-colors duration-300 ease-in-out p-3 hover:bg-main bg-white border-2 hover:border-slate-200 border-main hover:text-white text-main"
                aria-label={`Share on ${method.name}`}
              >
                {method.icon}
              </button>
            ),
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
