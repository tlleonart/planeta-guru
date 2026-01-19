"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type KeyboardEvent,
  useState,
} from "react";
import { Input } from "@/modules/shared/components/ui/input";

export const HeaderSearch: FC = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const t = useTranslations("Header");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/search/${encodeURIComponent(search.trim())}`);

    setSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        className="pl-10 h-9 bg-[#1a1a3e] border-[#2a2a5e] text-white placeholder:text-gray-400 rounded-md"
      />
    </form>
  );
};
