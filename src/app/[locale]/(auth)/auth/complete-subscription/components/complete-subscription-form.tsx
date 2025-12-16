/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
"use client"

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";

interface CompleteSubscriptionFormProps {
    externalId: string
}

export const CompleteSubscriptionForm: FC<CompleteSubscriptionFormProps> = ({ externalId }) => {
  const t = useTranslations("CompleteSubscription");

  const { setActive, signIn } = useSignIn();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);  
  
  const signInAndRedirect = async (userId: string) => {
    const resp = await fetch('/api/users/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const { token } = await resp.json();

    const attempt = await signIn?.create({ strategy: 'ticket', ticket: token });

    if (attempt?.status === 'complete' && setActive) {
      await setActive({ session: attempt.createdSessionId });
    }

    router.push("/help");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log('Submitting form with:', { firstName, lastName, userName, email, externalId });
    try {
      const existsRes = await fetch('/api/users/exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, externalId, userName }),
      });

      const existsData = await existsRes.json();

      if (
        existsData.matchedBy === 'externalId' ||
        existsData.matchedBy === 'email'
      ) {
        await signInAndRedirect(existsData.userId);
        return;
      }

      if (existsData.matchedBy === 'userName') {
        setError(existsData.message && t("userError"));
        return;
      }

      const resp = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, userName, email, externalId }),
      });
      
      if (!resp.ok) {
        const { message } = await resp.json();
        throw new Error(message || 'Error en registro');
      }

      const { userId } = await resp.json();

      await signInAndRedirect(userId);
      return
    } catch (err) {
      console.error('Error al completar la suscripción:', err);
      setError(t("genericError"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-black rounded-none shadow font-clerk">
      <h1 className="text-lg font-bold text-center mb-2">{t("title")}</h1>
      <p className="text-center text-[0.8125rem] text-gray-600 mb-6">{t("description")}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">

          <div className="flex flex-col gap-2">
            <Label className="flex justify-between text-[0.8125rem] font-semibold">
                {t("firstName")} 
                <span className="text-[0.7rem] text-gray-500">{t("optional")}</span>
            </Label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("firstNamePlaceholder")}
              className="w-full p-2 border rounded-none placeholder:text-[0.8125rem]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex justify-between text-[0.8125rem] font-semibold">
                {t("lastName")} 
                <span className="text-[0.7rem] text-gray-500">{t("optional")}</span>
            </Label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("lastNamePlaceholder")}
              className="w-full p-2 border rounded-none placeholder:text-[0.8125rem]"
            />
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <Label className="block text-[0.8125rem] font-semibold">{t("userName")}</Label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t("userNamePlaceholder")}
            required
            className="w-full p-2 border rounded-none placeholder:text-[0.8125rem]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="block text-[0.8125rem] font-semibold">{t("email")}</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className="w-full p-2 border rounded-none placeholder:text-[0.8125rem]"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-4 text-[0.8125rem] font-semibold cursor-pointer rounded-none"
        >
          {t("button")}
          <span className="ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 10 10"
              className="!h-[0.625rem] !w-[0.625rem]"
            >
              <path
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
              />
            </svg>
          </span>
        </Button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>  
    </div>
  );
}