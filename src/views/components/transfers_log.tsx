import {t} from "@/localization/i18n.ts";
import React, {type RefObject, useEffect, useRef, useState} from "react";
import {Bridge} from "@/utils/bridge.ts";

interface ViewProps {
  address: `0x${string}` | undefined;
  refreshTransfers: number;
  setRefreshBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function TransfersLog({address, refreshTransfers, setRefreshBalance}: ViewProps) {
  const i18nPage = "components.transfers_log";

  const contentRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  const [transfersLogVisible, setTransfersLogVisible] = useState(false);
  const [latestTransfers, setLatestTransfers] = useState([]);

  useEffect(() => {
    if (address) {
      getTransfers(address);

    } else {
      setLatestTransfers([]);
    }
  }, [address]);

  useEffect(() => {
    getTransfers(address, true);
    setTransfersLogVisible(refreshTransfers > 0);
  }, [refreshTransfers]);

  useEffect(() => {
    setMaxHeight(contentRef.current && transfersLogVisible ? `${contentRef.current.scrollHeight}px` : '0px');
  }, [transfersLogVisible, latestTransfers]);

  const getTransfers = (address: `0x${string}` | undefined, refresh: boolean = false, waitingPending: boolean = false) => {
    if (address) {
      fetch("https://api.debridge.finance/api/Transactions/getEvents", {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({
          "chainIdsFrom": [100000014, 8453],
          "chainIdsTo": [8453, 100000014],
          "filter": address,
          "skip": 0,
          "take": 10
        })
      })
        .then(response => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          setLatestTransfers(data.items);

          const hasPending = data.items.some((item: any) => item.isExecuted === false);
          if (hasPending) {
            setTimeout(() => { getTransfers(address, false, true) }, 7500);

          } else {
            if (refresh) {
              setTimeout(() => { getTransfers(address, true) }, 1500);

            } else {
              if (waitingPending) setRefreshBalance(refreshTransfers)
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }

  const handleTransfersLogView = () => {
    setTransfersLogVisible(!transfersLogVisible);
  }

  return (
    <div id="transfers-log" className={transfersLogVisible ? "visible" : ""}>
      <p className="title" onClick={handleTransfersLogView}>
        <i className={`icon-arrow-${transfersLogVisible ? "down" : "right"}`}></i>
        {t(`${i18nPage}.title`)}
      </p>

      <div className="transfers-list" ref={contentRef} style={{ maxHeight }}>
        {latestTransfers.length > 0 ? (
          <>
            <div className="header">
              <p className="transfer">{t(`${i18nPage}.transfer`)}</p>
              <p className="amount">{t(`${i18nPage}.amount`)}</p>
              <p className="direction">{t(`${i18nPage}.direction`)}</p>
              <p className="status">{t(`${i18nPage}.status`)}</p>
              <p className="view"></p>
            </div>

            {latestTransfers.map((item: any, index) => (
              <div className="item" key={index}>
                <p className="transfer" title={item.transactionHash}>{`${item.transactionHash.substring(0, 6)}...${item.transactionHash.slice(-4)}`}</p>
                <p className="amount">{Bridge.decodeAmountFromData(item.chainToId, item.data)}</p>
                <p className="direction">
                  {t(`${i18nPage}.${item.eventOriginChainId}`)}
                  <i className="icon-arrow-right"></i>
                  {t(`${i18nPage}.${item.chainToId}`)}
                </p>
                <p className="status">
                  {t(`${i18nPage}.${item.isExecuted ? "confirmed" : "pending"}`)}
                </p>
                <p className="view">
                  <a href={`https://app.debridge.finance/transaction?tx=${item.transactionHash}`} target="_blank">
                    {t(`${i18nPage}.view_explorer`)}
                  </a>
                </p>
              </div>
            ))}
          </>
        ) : (
          <p>{t(`${i18nPage}.empty`)}</p>
        )}
      </div>
    </div>
  );
}
