/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tx as TxDocument } from './interfaces/tx.interface';
import { CreateTxDto } from './dto/create-tx.dto';
import { publicKeyToAddress, txlib } from './tx.lib';
import * as txDemo from './txdemo-2.json';
import { TypeTxFetchBalance, TypeTxDoc, TypeTxParsed, TypeTxRaw } from './tx.types';
import { JwtService } from 'src/jwt/jwt.service';

enum ERRORS {
	TX_NOTVERIFIED_MSGSIG = 'TX_NOTVERIFIED_MSGSIG',
	TX_NOTVERIFIED_PAYLOAD = 'TX_NOTVERIFIED_PAYLOAD',
	TX_NOTVERIFIED_DATE = 'TX_NOTVERIFIED_DATE',
}

@Injectable()
export class TxService {
	constructor(
		@InjectModel('Tx') private readonly txCollection: Model<TxDocument>,
	) { }

	async test(): Promise<any> {
		return 'hello test'
	}

	async demoInit(): Promise<any> {

		//----------------------------
		const txDemo1 = txDemo[0];
		// await this.deleteAllTxs()
		return await this.createInitTx(txDemo1)
	}

	async demo(): Promise<any> {

		const arr: any[] = []
		for (const tx of txDemo) {

			const shouldAwait = true
			if (shouldAwait) {
				const res = (await this.txCreateRaw(tx, true).catch(e => console.log('tx skipped', e)));
				arr.push(res)
			} else {
				this.txCreateRaw(tx, true).then((res) => { arr.push(res) })
					.catch(e => console.log('tx skipped', e))
			}
		}
		return arr;
	}

	async getBalance(address: string, shouldVerifyTx = true): Promise<TypeTxFetchBalance> {
		const fetchedBalance = await this.fetchBalance(address)

		return fetchedBalance
	}

	async txCreate(createTxDto: CreateTxDto): Promise<any> {
		const res = (await this.txCreateRaw(createTxDto, true));
		return res;
	}

	async txRawPrepare(_tx: any): Promise<TypeTxRaw> {

		//-client-side demo-------------------------------------
		//--------create and sign tx----------------------------
		//------------------------------------------------------      
		const {
			senderPrivateKey,
			senderPublicKey,
			receiverPublicKey,
			amount
		} = _tx;

		const sender = publicKeyToAddress(senderPublicKey);
		const res = await this.getBalance(sender, false)

		const tx: TypeTxParsed = {
			sender,
			receiver: publicKeyToAddress(receiverPublicKey),
			amount: amount,
			txCount: (res?.count || 0) + 1,
			totalBalance: (res?.totalBalanceAcc?.totalBalance || 0),
			lastTxHash: res?.lastTxHash,
			date: txlib.getTimeStamp(),
		};
		const { signature, txJson: txRawJson } = txlib.signTx({
			tx,
			privateKey: senderPrivateKey
		});

		// receivedTx is the final object sent to the server
		const txRaw: TypeTxRaw = {
			publicKey: senderPublicKey,
			signature,
			txRawJson,
		}
		return await Promise.resolve(txRaw);
	}


	async txValidate(txRaw: TypeTxRaw, shouldVerifyTx = true): Promise<[boolean, TypeTxDoc]> {


		//-server-side demo-----(receivedTx)--------------------
		//------------------------------------------------------
		//------------------------------------------------------      
		const parsedTx: TypeTxParsed = JSON.parse(txRaw.txRawJson);
		const fetchedBalance = await this.fetchBalance(parsedTx.sender)
		const balance = fetchedBalance?.totalBalanceAcc?.totalBalance
		const prevTxHash = fetchedBalance?.lastTxHash
		const txCount = (fetchedBalance?.lastTxCount || 0) + 1
		const errorMsg = ''
		const txMeta = {
			tx: parsedTx,
			txHash: await this.hash(txRaw.txRawJson),
			prevTxHash,
			txCount,
			totalBalance: balance
		}
		// const { errorMsg, balance, prevTxHash, txCount } = fetchedBalance.totalBalanceAcc

		//-verify tx--------------------------------------------
		//------------------------------------------------------
		//------------------------------------------------------
		let isTxVerified = true
		if (shouldVerifyTx) {
			if (!txlib.isVerifyTxRawSignature(txRaw)) {
				isTxVerified = false
				// throw new Error(ERRORS.TX_NOTVERIFIED_MSGSIG);
			}
			// if (errorMsg) {
			// isTxVerified = false
			// console.log(`errorMsg: ${errorMsg}`);
			// throw new Error(errorMsg);}
			// }
			isTxVerified = parsedTx.amount <= balance

		}

		//-create parsedTx in db--------------------------------
		//------------------------------------------------------
		//------------------------------------------------------
		// if (isTxVerified) {
		// console.log(`${parsedTx.sender} -> ${parsedTx.receiver}: ${parsedTx.amount}/${balance}`);

		const txDocToSave: TypeTxDoc = {
			txRaw,
			txMeta,
		}
		// const txDoc = new this.txCollection(txDocToSave);
		// await txDoc.save();
		// return txDoc.toObject();

		// } else {
		// console.log(`${parsedTx.sender} -> ${parsedTx.receiver}: ${parsedTx.amount}/${balance} failed:${errorMsg || ERRORS.TX_NOTVERIFIED_PAYLOAD}`);
		// }

		return [isTxVerified, txDocToSave]

	}

	async txCreateRaw(_tx: any, shouldVerifyTx: boolean): Promise<any> {

		const txRaw = await this.txRawPrepare(_tx)
		const [isTxVerified, txDocToSave] = await this.txValidate(txRaw)
		if (isTxVerified) {
			const txDoc = new this.txCollection(txDocToSave);
			await txDoc.save();
			return txDoc.toObject()
		}
		return txDocToSave
	}

	async createInitTx({
		senderPublicKey,
		senderPrivateKey,
		receiverPublicKey,
	}) {

		const amountToAdd = 100
		const sender = 'SYSTEM'
		const fetched = await this.getBalance(sender); // { errorMsg, balance, count, lastTxHash }
		const newTxCount = (fetched?.count || 0) + 1;
		const lastTxHash = fetched?.lastTxHash || 'INIT'

		const initTx: TypeTxParsed = {
			sender: 'SYSTEM',
			receiver: publicKeyToAddress(receiverPublicKey),
			amount: amountToAdd,
			txCount: newTxCount,
			totalBalance: fetched?.totalBalanceAcc?.totalBalance || 0,
			message: 'SYSTEM',
			lastTxHash,
			date: txlib.getTimeStamp(),
		}

		const { signature, txJson: txRawJson } = txlib.signTx({
			tx: initTx,
			privateKey: senderPrivateKey
		});

		const txHash = await this.hash(txRawJson)


		const txDocToSave: TypeTxDoc = {
			txRaw: {
				signature,
				txRawJson,
				publicKey: senderPublicKey
			},
			txMeta: {
				tx: initTx,
				txHash,
				prevTxHash: lastTxHash || 'undefined',
				txCount: newTxCount,
			}
		}
		const txDoc = new this.txCollection(txDocToSave);
		await txDoc.save();
		return txDoc.toObject();


	}

	async hash(message) {
		const hash = txlib.hash(message)
		return await Promise.resolve(hash);
	}

	async getAddressFromPublic(publicKey) {
		const hash = this.hash(publicKey)
		return await Promise.resolve(hash);
	}

	async getAllTxs(): Promise<TxDocument[]> {
		return await this.txCollection.find({});
	}

	async deleteAllTxs(): Promise<void> {
		await this.txCollection.deleteMany({});
	}

	async verifySenderBalance({ tx }) { }

	async fetchTxHistory(address: string, sort = {}): Promise<any> {
		const txs = await this.txCollection.find(
			{
				$or: [{ 'txMeta.tx.receiver': address }, { 'txMeta.tx.sender': address }],
			},
			{
				// 'txMeta.tx': 1,
			},
			{
				sort: sort ?? {
					'tx.date': 1,
				},
			},
		);
		return txs.map(tx => tx.toObject());
	}

	async fetchBalance(address: string): Promise<TypeTxFetchBalance> {
		const tx = await this.txCollection.aggregate([
			{
				$match: {
					$or: [
						{ 'txMeta.tx.receiver': address },
						{ 'txMeta.tx.sender': address }
					]
				}
			},
			{
				$sort: {
					'txMeta.tx.date': 1
				}
			},
			{
				$group: {
					_id: null,
					totalBalance: {
						$sum: {
							$cond: [
								{ $eq: ["$txMeta.tx.receiver", address] },
								"$txMeta.tx.amount",
								{ $multiply: ["$txMeta.tx.amount", -1] }
							]
						}
					},
					totalBalanceAcc: {
						$accumulator: {
							init: function () { return { balance: 0, error: null } },
							accumulate: function (state, receiver, amount, txId, address) {
								state.balance += (receiver === address ? amount : -amount);
								if (state.balance < 0) {
									state.error = {
										note: "Negative balance detected",
										txId,
									};
								}
								return state;
							},
							accumulateArgs: ["$txMeta.tx.receiver", "$txMeta.tx.amount", "$_id", address],
							merge: function (state1, state2) {
								return { balance: state1.balance + state2.balance, error: state1.error || state2.error };
							},
							finalize: function (state) {
								return { totalBalance: state.balance, error: state.error };
							},
							lang: "js",
						}
					},
					hashAcc: {
						$accumulator: {
							init: function () { return { hash: null, error: null } },
							accumulate: function (statePrevTx, txHash, prevTxHash, txId) {

								if (!!statePrevTx.hash && statePrevTx.hash !== prevTxHash) {
									statePrevTx.error = {
										note: `Hash error detected ${statePrevTx.hash} !== ${prevTxHash}`,
										txId,
									};
								}
								statePrevTx.prevHash = txHash;
								return statePrevTx;
							},
							accumulateArgs: ["$txMeta.txHash", "$txMeta.prevTxHash", "$_id"],
							merge: function (state1, state2) {
								return { error: state1.error || state2.error, prevHash: state1.prevHash };
							},
							finalize: function (state) {
								return { hash: state.prevHash, error: state.error };
							},
							lang: "js",
						}
					},
					dateAcc: {
						$accumulator: {
							init: function () { return { date: 0, error: null } },
							accumulate: function (state, date, txId) {
								if (state.date && !(state.date < date)) {
									state.error = {
										note: "Date error detected",
										txId,
									};
								}
								state.date = date
								return state;
							},
							accumulateArgs: ["$createdAt", "$_id"],
							merge: function (state1, state2) {
								return { error: state1.error || state2.error };
							},
							finalize: function (state) {
								return { error: state.error };
							},
							lang: "js",
						}
					},
					count: { $sum: 1 },
					lastTxCount: { $last: "$txMeta.txCount" },
					lastTxHash: { $last: "$txMeta.txHash" },
					lastTxId: { $last: "$_id" },
					txIds: { $push: "$_id" },
				}
			},
			{
				$project: {
					_id: 0,
					lastTxId: 1,
					lastTxHash: 1,
					lastTxCount: 1,
					count: 1,
					hashAcc: 1,
					dateAcc: 1,
					totalBalance: 1,
					totalBalanceAcc: 1,
					txIds: 1,
				}
			}
		]);

		// return txs.map(tx => tx.toObject());
		return tx['0']
	}

	async getAllAccounts(): Promise<any> {
		const pipeline = [
			{
				$project: {
					receiver: "$txMeta.tx.receiver"
				}
			},
			{
				$group: {
					_id: "$receiver"
				}
			}
		];

		const result = await this.txCollection.aggregate(pipeline);
		return result.map(obj => obj._id);
	}

	async getSystemBalance(): Promise<any> {
		const addressList = await this.getAllAccounts();
		const results = await Promise.all(addressList.map(address => this.fetchBalance(address)));
		const sums = [...results].map(obj => obj.totalBalanceAcc.totalBalance);
		return sums.reduce((a, b) => a + b, 0);
	}

	async fetchTxsByList(addressList: string[]) {
		const tx = await this.txCollection.find({ _id: { $in: addressList } });
		// return txs.map(tx => tx.toObject());
		return tx
	}
	JwtTest() {

		const jwtService = new JwtService();

		const token = jwtService.signToken({ userId: '123', role: 'admin' });

		console.log('JWT:', token);

		const decoded = jwtService.verifyToken(token);
		console.log('Decoded:', decoded);

	}
}
