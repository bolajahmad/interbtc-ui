import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
    changeRedeemStepAction,
    changeAmountPolkaBTCAction,
    changeVaultBtcAddressOnRedeemAction,
    changeVaultDotAddressOnRedeemAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC } from "@interlay/polkabtc";
import { getAddressFromH160 } from "../../../common/utils/utils";

type EnterPolkaBTCForm = {
    amountPolkaBTC: string;
};

export default function EnterPolkaBTCAmount() {
    const [isRequestPending, setRequestPending] = useState(false);
    const [balancePolkaBTC, setBalancePolkaBTC] = useState("0");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount } } : undefined;
    const { register, handleSubmit, errors } = useForm<EnterPolkaBTCForm>(defaultValues);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const address = window.polkaBTC.account?.toString();
            const accountId = window.polkaBTC.api.createType("AccountId", address) as any;
            const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
            // TODO: write data to storage
            const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());
            setBalancePolkaBTC(balancePolkaBTC);
        };
        fetchData();
    }, [polkaBtcLoaded]);

    const onSubmit = handleSubmit(async ({ amountPolkaBTC }) => {
        if (!polkaBtcLoaded) return;

        setRequestPending(true);
        try {
            const amountPolkaSAT = btcToSat(amountPolkaBTC);
            if (amountPolkaSAT === undefined) {
                throw new Error("Invalid PolkaBTC amount input");
            }
            dispatch(changeAmountPolkaBTCAction(amountPolkaBTC));
            const amount = window.polkaBTC.api.createType("Balance", amountPolkaSAT);
            const vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amount);

            toast.success("Found vault: " + vaultId.toString());

            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = getAddressFromH160(vault.wallet.address);
            if (vaultBTCAddress === undefined) {
                throw new Error("Vault has invalid BTC address.");
            }

            dispatch(changeVaultBtcAddressOnRedeemAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressOnRedeemAction(vaultId.toString()));
            dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <p>Please enter the amount of PolkaBTC you want to receive in BTC.</p>
                <p>You have {balancePolkaBTC} PolkaBTC</p>
                <input
                    name="amountPolkaBTC"
                    type="string"
                    className={"custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")}
                    ref={register({
                        required: true,
                        max: {
                            value: balancePolkaBTC,
                            message: "Please enter amount less then " + balancePolkaBTC,
                        },
                    })}
                />
                {errors.amountPolkaBTC && (
                    <div className="input-error">
                        {errors.amountPolkaBTC.type === "required"
                            ? "Please enter the amount"
                            : errors.amountPolkaBTC.message}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <ButtonMaybePending
                    className="btn btn-primary float-right"
                    isPending={isRequestPending}
                    onClick={onSubmit}
                >
                    Search Vault
                </ButtonMaybePending>
            </Modal.Footer>
        </form>
    );
}
