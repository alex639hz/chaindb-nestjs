export type TypeTxRaw = {
  publicKey: string;
  signature: string;
  txRawJson: string;
};
export type TypeTxParsed = {
  sender: string;
  receiver: string;
  amount: number;
  txCount: number;
  totalBalance: string;
  message?: string;
  lastTxHash: string;
  date?: string;
};

export type TypeTxDoc = {
  _id?: string;
  txRaw: TypeTxRaw;
  txMeta: TypeTxMeta;
};

export type TypeTxHash = string;

export type TypeTxMeta = {
  tx: TypeTxParsed;
  txHash: TypeTxHash;
  prevTxHash: TypeTxHash;
  txCount: number;
};

export type TypeTxFetchBalance = {
  _id: any;
  lastTxId: any;
  lastTxHash: any;
  lastTxCount: any;
  count: number;
  hashAcc: any;
  dateAcc: any;
  totalBalance: any;
  totalBalanceAcc: any;
  txIds: any;
}