import React, {useEffect, useState} from "react";
import {t} from "@/localization/i18n.ts";

interface ViewProps {
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  multiplier: number;
  setMultiplier: React.Dispatch<React.SetStateAction<number>>;
}

export function SettingsModal({settingsVisible, setSettingsVisible, multiplier, setMultiplier}: ViewProps) {
  const i18nPage = "components.settings_modal";

  const [multiplierOption, setMultiplierOption] = useState('1.5');

  useEffect(() => {
    setMultiplierOption(multiplier.toString());
  }, [settingsVisible]);

  const closeSettingsModal = (e: React.SyntheticEvent) => {
    if ((e.target as HTMLElement).id === "settings-modal") {
      setSettingsVisible(false);
    }
  }

  const handleSettingsSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMultiplier(parseFloat(multiplierOption));
    setSettingsVisible(false);
  }

  return (
    <div id="settings-modal" className={settingsVisible ? "visible" : ""} onClick={closeSettingsModal}>
      <form className="content" onSubmit={handleSettingsSubmit}>
        <p className="title">{t(`${i18nPage}.title`)}</p>

        <div className="input-radio">
          <input id="gas-1" type="radio" name="gas" value="1" checked={multiplierOption === '1'}
                 onChange={(e) => setMultiplierOption(e.target.value)}/>
          <label htmlFor="gas-1">{t(`${i18nPage}.1`)}</label>
        </div>

        <div className="input-radio">
          <input id="gas-1.5" type="radio" name="gas" value="1.5" checked={multiplierOption === '1.5'}
                 onChange={(e) => setMultiplierOption(e.target.value)}/>
          <label htmlFor="gas-1.5">{t(`${i18nPage}.1.5`)}</label>
        </div>

        <div className="input-radio">
          <input id="gas-2" type="radio" name="gas" value="2" checked={multiplierOption === '2'}
                 onChange={(e) => setMultiplierOption(e.target.value)}/>
          <label htmlFor="gas-2">{t(`${i18nPage}.2`)}</label>
        </div>

        <button type="submit" className="button">{t("general.ok")}</button>
      </form>
    </div>
  );
}