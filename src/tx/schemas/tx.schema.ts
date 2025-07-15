/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import bcrypt from 'bcrypt';

enum TxStatus {
    CREATED = 'CREATED',
}
// const txHashDef = {
//     message: String,
//     hash: {
//         type: String
//         inde
//     }
// }
export const TxSchema = new mongoose.Schema({
    txRaw: {
        signature: String,
        txRawJson: String,
        publicKey: String,

    },
    txMeta: {
        tx: {
            sender: String,
            receiver: String,
            amount: Number,
            date: String,
        },
        senderBalance: Number,
        txHash: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        prevTxHash: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        txCount: {
            type: Number,
            index: true,
            required: true,
            unique: true,
            default: 0
        }
    },
    // accountSender: {
    //     type: String,
    //     lowercase: true,
    //     // validate: validator.isEmail,
    //     maxlength: 255,
    //     minlength: 6,
    //     required: [true, 'SENDER_IS_BLANK'],
    // },
    // accountReceiver: {
    //     type: String,
    //     lowercase: true,
    //     // validate: validator.isEmail,
    //     maxlength: 255,
    //     minlength: 6,
    //     required: [true, 'RECEIVER_IS_BLANK'],
    // },
    // txAmount: {
    //     type: Number,
    //     required: [true, 'AMOUNT_IS_BLANK'],
    // },
    // txHashPrevious: {
    //     type: String,
    //     lowercase: true,
    //     // validate: validator.isEmail,
    //     maxlength: 255,
    //     minlength: 6,
    //     required: [true, 'PREVTX_IS_BLANK'],
    //     unique: true,
    // },
    // txHash: {
    //     type: String,
    //     lowercase: true,
    //     // validate: validator.isEmail,
    //     maxlength: 255,
    //     minlength: 6,
    //     required: [true, 'HASH_IS_BLANK'],
    //     unique: true,
    // },
    // txType: {
    //     type: String,
    //     required: [true, 'TYPE_IS_BLANK'],
    //     enum: [...Object.values(TxStatus)],
    // },
}, {
    versionKey: false,
    timestamps: true,
});

TxSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        // tslint:disable-next-line:no-string-literal
        const hashed = await bcrypt.hash(this['password'], 10);
        // tslint:disable-next-line:no-string-literal
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});