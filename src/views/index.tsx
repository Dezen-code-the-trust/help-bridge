import React, { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base, sonic } from 'wagmi/chains'
import { Layout } from '@/views/layout';
import { t } from "@/localization/i18n";
import { Bridge } from "@/utils/bridge";
import { formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit';


export function Index() {
  const i18nPage = "pages.index";
  const { switchChain } = useSwitchChain()

  const { openConnectModal } = useConnectModal();
  const { address, isConnected, chainId } = useAccount();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [qty, setQty] = useState(parseInt(""));
  const [multiplier, setMultiplier] = useState(1.5);
  const [multiplierOption, setMultiplierOption] = useState('1.5');
  const [reverse, setReverse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [helpToken, setHelpToken] = useState({
    symbol: "MON",
    balance: 0n,
    fee: 0n,
    networkSymbol: "ETH"
  });

  const [sHelpToken, setShelpToken] = useState({
    symbol: "sMON",
    balance: 0n,
    fee: 0n,
    networkSymbol: "S"
  });

  const getToken = (position) => {
    if (position === 0) {
      return reverse ? sHelpToken : helpToken;

    } else {
      return reverse ? helpToken : sHelpToken;
    }
  }

  useEffect(() => {
    if (isConnected) {
      switchChain({chainId: reverse ? sonic.id : base.id});
    } else {
      setHelpToken(prev => ({ ...prev, balance: 0n }));
      setShelpToken(prev => ({ ...prev, balance: 0n }));
      setQty(parseInt(""));
    }
  }, [isConnected]);

  useEffect(() => {
    if (chainId === base.id) {
      setReverse(false);

    } else if (chainId === sonic.id) {
      setReverse(true);
    }
  }, [chainId]);

  useEffect(() => {
    (async () => {
      const fee = await Bridge.helpFee(multiplier);
      setHelpToken(prev => ({ ...prev, fee: fee }));
    })();

    (async () => {
      const fee = await Bridge.sHelpFee(multiplier);
      setShelpToken(prev => ({ ...prev, fee: fee }));
    })();
  }, [multiplier]);

  useEffect(() => {
    if (address) {
      (async () => {
        const balance = await Bridge.helpBalance(address);
        setHelpToken(prev => ({ ...prev, balance: balance }));
      })();

      (async () => {
        const balance = await Bridge.sHelpBalance(address);
        setShelpToken(prev => ({ ...prev, balance: balance }));
      })();
    }
  }, [address]);

  useEffect(() => {
    const balance = parseFloat(
      formatEther(
        getToken(0).balance
      )
    );
    if (qty > balance) { setQty(balance); }
  }, [reverse]);

  const handleQtyChange = (e) => {
    if (e.target.value === "") {
      setQty(parseInt(""));

    } else {
      setQty(Math.min(e.target.value, parseFloat(formatEther(getToken(0).balance))));
    }
  }

  const handleReverse = () =>  {
    if (!isLoading) {
      setReverse(!reverse);
      switchChain({chainId: reverse ? base.id : sonic.id});
    }
  }

  const handleBridgeButton = async () => {
    if (qty > 0) {
      setIsLoading(true);
      switchChain({ chainId: reverse ? sonic.id : base.id });

      try {
        await Bridge.execute(getToken(0).symbol, address, qty, multiplier);

      } catch(e) {
        console.error(e);
      }

      setIsLoading(false);
    }
  }

  const openSettingsModal = () => {
    setMultiplierOption(multiplier.toString());
    setSettingsVisible(true);
  }

  const closeSettingsModal = (e) => {
    if (e.target.id === "settings-modal") {
      setSettingsVisible(false);
    }
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setMultiplier(parseFloat(multiplierOption));
    setSettingsVisible(false);
  }

  return (
    <>
      <Layout action="index">
        <div className="container">
          <form id="bridge" className="xs-12 sm-8 md-6 sm-offset-2 md-offset-3">
            <div className="bridge-header">
              <p className="title">{t(`${i18nPage}.bridge.title`)}</p>
              <i className="button-settings icon-settings" onClick={openSettingsModal}></i>
            </div>

            <div className="input-prefix">
              <i className={`icon-${reverse ? "sonic" : "base"}`}></i>

              <div>
                <div className="input">
                  <label htmlFor="qty">{t(`${i18nPage}.bridge.from_${reverse ? "sonic" : "base"}`)}</label>
                  <span className="prefix">{getToken(0).symbol}</span>
                  <input id="qty"
                         type="number"
                         min="0"
                         disabled={isLoading}
                         placeholder="0.0"
                         value={isNaN(qty) ? "" : qty}
                         max={formatEther(getToken(0).balance)}
                         onChange={handleQtyChange}/>
                </div>

                <div className="input-footer">
                  <span>
                    {t(`${i18nPage}.bridge.balance`, { balance: formatEther(getToken(0).balance),
                                                       symbol: getToken(0).symbol })}
                  </span>
                </div>
              </div>
            </div>

            <div className="separator">
              <span className="button icon-change" onClick={handleReverse}></span>
            </div>

            <div className="input-prefix">
              <i className={`icon-${reverse ? "base" : "sonic"}`}></i>

              <div>
                <div className="input">
                  <label htmlFor="qty">{t(`${i18nPage}.bridge.to_${reverse ? "base" : "sonic"}`)}</label>
                  <span className="prefix">{getToken(1).symbol}</span>
                  <input type="text" disabled="disabled" placeholder="0.0" value={isNaN(qty) ? "" : qty}/>
                </div>

                <div className="input-footer">
                  <span dangerouslySetInnerHTML={{ __html:
                      t(`${i18nPage}.bridge.address`, {
                        address: address,
                        link: `${t(`general.${reverse ? "base" : "sonic"}_explorer_url`)}${address}`,
                      })
                  }}/>
                </div>
              </div>
            </div>

            {isConnected ? (
              <>
                {isLoading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <>
                    <span className={`bridge-tokens button${isNaN(qty) || qty === 0 ? " disabled" : ""}`}
                          onClick={handleBridgeButton}>{t(`${i18nPage}.bridge.bridge`)}</span>

                    <p className="fee">
                      {t(`${i18nPage}.bridge.fee`, {
                        speed: t(`${i18nPage}.gas.short.${multiplier}`),
                        fee: formatEther(getToken(0).fee),
                        symbol: getToken(0).networkSymbol
                      })}
                    </p>
                  </>
                )}
              </>
            ) : (
              <span onClick={openConnectModal} className="connect-wallet button">
                  {t("general.connect_wallet")}
                </span>
            )}

            <div className="texts">
              <p>{t(`${i18nPage}.texts.text1`)}</p>
              <p>{t(`${i18nPage}.texts.text2`)}</p>
              <ul>
                <li>{t(`${i18nPage}.texts.li1`)}</li>
                <li>{t(`${i18nPage}.texts.li2`)}</li>
              </ul>
              <p>{t(`${i18nPage}.texts.text3`)}</p>
              <p>{t(`${i18nPage}.texts.text4`)}</p>
            </div>
          </form>
        </div>
      </Layout>

      <div id="settings-modal" className={settingsVisible ? "visible" : ""} onClick={closeSettingsModal}>
        <form className="content" onSubmit={handleSettingsSubmit}>
          <p className="title">{t(`${i18nPage}.gas.title`)}</p>

          <div className="input-radio">
            <input id="gas-1" type="radio" name="gas" value="1" checked={multiplierOption === '1'}
                   onChange={(e) => setMultiplierOption(e.target.value)}/>
            <label htmlFor="gas-1">{t(`${i18nPage}.gas.full.1`)}</label>
          </div>

          <div className="input-radio">
            <input id="gas-1.5" type="radio" name="gas" value="1.5" checked={multiplierOption === '1.5'}
                   onChange={(e) => setMultiplierOption(e.target.value)}/>
            <label htmlFor="gas-1.5">{t(`${i18nPage}.gas.full.1.5`)}</label>
          </div>

          <div className="input-radio">
            <input id="gas-2" type="radio" name="gas" value="2" checked={multiplierOption === '2'}
                   onChange={(e) => setMultiplierOption(e.target.value)}/>
            <label htmlFor="gas-2">{t(`${i18nPage}.gas.full.2`)}</label>
          </div>

          <button type="submit" className="button">{t("general.ok")}</button>
        </form>
      </div>
    </>
  );
}
