import React, { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base, sonic } from 'wagmi/chains'
import { Layout } from '@/views/layout';
import { t } from "@/localization/i18n";
import { Bridge } from "@/utils/bridge";
import { formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { TransfersLog } from "@/views/components/transfers_log.tsx";
import { SettingsModal } from "@/views/components/settings_modal.tsx";


export function Index() {
  const i18nPage = "pages.index";
  const { switchChain } = useSwitchChain()

  const { openConnectModal } = useConnectModal();
  const { address, isConnected, chainId } = useAccount();

  const [settingsVisible, setSettingsVisible] = useState(false);

  const [qty, setQty] = useState(parseInt(""));
  const [multiplier, setMultiplier] = useState(1.5);
  const [reverse, setReverse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [refreshBalance, setRefreshBalance] = useState(0);
  const [refreshTransfers, setRefreshTransfers] = useState(0);

  const [helpToken, setHelpToken] = useState({
    symbol: "HELP",
    balance: 0n,
    fee: 0n,
    networkSymbol: "ETH"
  });

  const [sHelpToken, setShelpToken] = useState({
    symbol: "sHELP",
    balance: 0n,
    fee: 0n,
    networkSymbol: "S"
  });

  const getToken = (position: number) => {
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

    } else {
      setHelpToken(prev => ({ ...prev, balance: 0n }));
      setShelpToken(prev => ({ ...prev, balance: 0n }));
    }
  }, [address, refreshBalance, refreshTransfers]);

  useEffect(() => {
    const balance = parseFloat(
      formatEther(
        getToken(0).balance
      )
    );
    if (qty > balance) { setQty(balance); }
  }, [reverse]);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setQty(parseInt(""));

    } else {
      setQty(Math.min(parseFloat(e.target.value), parseFloat(formatEther(getToken(0).balance))));
    }
  }

  const handleReverse = () =>  {
    if (!isLoading) {
      setReverse(!reverse);
      switchChain({chainId: reverse ? base.id : sonic.id});
    }
  }

  const handleBridgeButton = async () => {
    if (address && qty > 0) {
      setErrorMessage("");
      setIsLoading(true);
      switchChain({ chainId: reverse ? sonic.id : base.id });

      try {
        await Bridge.execute(getToken(0).symbol, address, qty, multiplier);
        setRefreshTransfers(refreshTransfers + 1);

      } catch(e: any) {
        console.error(e);
        setErrorMessage(e.details);
      }

      setIsLoading(false);
    }
  }

  return (
    <>
      <Layout action="index">
        <div className="container">
          <div className="xs-12 sm-10 md-8 sm-offset-1 md-offset-2">
            <form id="bridge">
              <div className="bridge-header">
                <p className="title">{t(`${i18nPage}.bridge.title`)}</p>
                <i className="button-settings icon-settings" onClick={() => setSettingsVisible(true)}></i>
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
                      {t(`${i18nPage}.bridge.balance`, {
                        balance: formatEther(getToken(0).balance),
                        symbol: getToken(0).symbol
                      })}
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
                    <input type="text" disabled={true} placeholder="0.0" value={isNaN(qty) ? "" : qty}/>
                  </div>

                  <div className="input-footer">
                    {address && (
                      <span dangerouslySetInnerHTML={{
                        __html:
                          t(`${i18nPage}.bridge.address`, {
                            address: address,
                            link: `${t(`general.${reverse ? "base" : "sonic"}_explorer_url`)}${address}`,
                          })
                      }}/>
                    )}
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
                          speed: t(`${i18nPage}.gas.${multiplier}`),
                          fee: formatEther(getToken(0).fee),
                          symbol: getToken(0).networkSymbol
                        })}
                      </p>

                      {errorMessage != "" && (
                        <p className="error">{errorMessage}</p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <span onClick={openConnectModal} className="connect-wallet button">
                  {t("general.connect_wallet")}
                </span>
              )}
            </form>

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

            <TransfersLog address={address} refreshTransfers={refreshTransfers} setRefreshBalance={setRefreshBalance}/>
          </div>
        </div>
      </Layout>

      <SettingsModal settingsVisible={settingsVisible} setSettingsVisible={setSettingsVisible}
                     multiplier={multiplier} setMultiplier={setMultiplier}/>
    </>
  );
}