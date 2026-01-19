"use client";

import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type KeyboardEvent,
  useState,
} from "react";
import { Input } from "./input";

export const Searchbar: FC = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

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
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search…"
        className="w-full p-2 border rounded-none"
      />
    </form>
  );
};
