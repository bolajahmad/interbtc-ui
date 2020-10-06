export interface RedeemRequest {
    id: string;
    amountPolkaBTC: string;
    creation: Date;
    vaultBTCAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
}

export interface Redeem {
    step: string;
    amountPolkaBTC: string;
    btcAddress: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
}