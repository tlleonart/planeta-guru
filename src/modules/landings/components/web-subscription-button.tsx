"use client";

import { vodacomWebSubscribeAction } from "@/app/actions";
import { Button } from "@/modules/shared/components/ui/button";
import { FC, useState, useTransition } from "react";

export const VodacomWebSubscriptionButton: FC = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onClick = () => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      vodacomWebSubscribeAction()
        .then((value) => {
          setSuccess(value.message);
          document.location.href = value.url;
        })
        .catch((error) => setError(error.message));
    });
  };

  return (
    <>
      <Button
        type="button"
        className="bg-[#5a7bd0] hover:bg-[#4a6bc0] text-white font-bold py-4 px-8 rounded-md text-center transition-colors disabled:opacity-30"
        onClick={onClick}
        disabled={isPending}
      >
        SUSBSCRIBE NOW
      </Button>
      <div className="absolute bottom-10 text-xl w-full bg-green-300">
        {success}
      </div>
      <div className="absolute bottom-10 text-3xl w-full bg-red-300">
        {error}
      </div>
    </>
  );
};
