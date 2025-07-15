export type TypeTxRaw = {
  publicKey: string;
  signature: string;
  txRawJson: string;
};
export type TypeTxParsed = {
  sender: string;
  receiver: string;
  amount: number;
  date: string;
};

export type TypeTxDoc = {
  _id?: string;
  txRaw: TypeTxRaw;
  txMeta: TypeTxMeta;
};

export type TypeTxHash = string;

export type TypeTxMeta = {
  tx: TypeTxParsed;
  senderBalance: number;
  txHash: TypeTxHash;
  prevTxHash: TypeTxHash;
  txCount: number;
};
