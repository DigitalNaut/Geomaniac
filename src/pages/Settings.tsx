import type { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "src/components/common/Button";
import Toggle from "src/components/common/Toggle";
import MainView from "src/components/layout/MainView";
import { useSettings } from "src/hooks/useSettings";

function SettingInfo({
  label,
  description,
  info,
  small,
  children,
}: PropsWithChildren<{
  label: ReactNode;
  description?: ReactNode;
  info?: ReactNode;
  small?: true;
}>) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className={twMerge(small ? "text-base" : "text-lg")}>{label}</div>
        {children}
      </div>
      <div className="text-sm">{description}</div>
      <div className="text-sm italic">{info}</div>
    </div>
  );
}

function SettingsSection({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-4 rounded-md bg-white/5 px-6 py-4">{children}</div>;
}

export default function Settings() {
  const { useReducedMotion, resetSettings, toggleUseReducedMotion } = useSettings();

  return (
    <MainView className="sm:flex-col">
      <h1 className="w-full p-2 text-center text-xl font-bold">Preferences</h1>
      <div className="flex w-full flex-1 gap-2 overflow-y-auto p-4">
        <div className="mx-auto flex flex-col gap-4 rounded-md bg-slate-800 p-8 shadow-2xl">
          <SettingsSection>
            <SettingInfo
              label="Reduced motion"
              description="Use snappy transitions and animations to reduce motion sickness."
            >
              <Toggle value={useReducedMotion} onChange={toggleUseReducedMotion} />
            </SettingInfo>
          </SettingsSection>

          <div className="mt-4 flex w-full justify-end">
            <Button onClick={resetSettings} variant="secondary">
              Restore defaults
            </Button>
          </div>
        </div>
      </div>
    </MainView>
  );
}
