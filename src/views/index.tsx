import React, { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base, sonic } from 'wagmi/chains'
import { Layout } from '@/views/layout';
import { t } from "@/localization/i18n";
import { Bridge } from "@/utils/bridge";
import { formatEther } from 'viem'

export function Index() {
  const i18nPage = "pages.index";
  const { switchChain } = useSwitchChain()

  const { address, isConnected, chainId } = useAccount();

  const [qty, setQty] = useState(parseInt(""));
  const [multiplier, setMultiplier] = useState(1);
  const [reverse, setReverse] = useState(false);

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

  const handleMaxButton = () => {
    setQty(
      parseFloat(
        formatEther(getToken(0).balance)
      )
    );
  }

  const handleQtyChange = (e) => {
    if (e.target.value === "") {
      setQty(parseInt(""));

    } else {
      setQty(Math.min(e.target.value, parseFloat(formatEther(getToken(0).balance))));
    }
  }

  const handleReverse = () =>  {
    setReverse(!reverse);
    switchChain({ chainId: reverse ? base.id : sonic.id });
  }

  const handleBridgeButton = () => {
    if (qty > 0) {
      switchChain({ chainId: reverse ? sonic.id : base.id });
      Bridge.execute(getToken(0).symbol, address, qty, multiplier);
    }
  }

  return (
    <Layout action="index">
      <div className="container">
        <form id="bridge" className="xs-12 sm-6 md-4 sm-offset-3 md-offset-4">
          <div className="input-prefix">
            <div className="input-header">
              <span className="button secondary" onClick={handleMaxButton}>
                {t(`${i18nPage}.bridge.max`)}
              </span>

              <span>{t(`${i18nPage}.bridge.balance`, {
                balance: formatEther(getToken(0).balance),
                symbol: getToken(0).symbol
              })}</span>
            </div>

            <div className="input">
              <span className="prefix">{getToken(0).symbol}</span>
              <input name="qty"
                     type="number"
                     min="0"
                     value={isNaN(qty) ? "" : qty}
                     max={formatEther(getToken(0).balance)}
                     onChange={handleQtyChange}/>
            </div>
          </div>

          <span className="button secondary center" onClick={handleReverse}>
            { t(`${i18nPage}.bridge.reverse`) }
          </span>

          <div className="input-prefix">
            <div className="input-header">
              <span>{t(`${i18nPage}.bridge.balance`, {
                balance: formatEther(getToken(1).balance),
                symbol: getToken(1).symbol
              })}</span>
            </div>

            <div className="input">
              <span className="prefix">{getToken(1).symbol}</span>
              <input type="text" disabled="disabled" value={isNaN(qty) ? "" : qty}/>
            </div>
          </div>

          <p className="fee">
            {t(`${i18nPage}.bridge.fee`, {
              fee: formatEther(getToken(0).fee),
              symbol: getToken(0).networkSymbol
            })}
          </p>

          <span className={`button center${isNaN(qty) || qty === 0 ? " disabled" : ""}`} onClick={handleBridgeButton}>{ t(`${i18nPage}.bridge.bridge`) }</span>
        </form>
      </div>
    </Layout>
  );
}
