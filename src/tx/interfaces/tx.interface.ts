/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface Tx {
    publicKey?: string,
    message?: string,
    signature?: string,
    sender: string,
    receiver: string,
    amount: number
    // sender: string,
    // receiver: string,
    // amount: number,
    // fee: number,
    // coin: string,
    // date: string,
    // signature: string,
};
export interface TxDocument extends Tx, Document { };