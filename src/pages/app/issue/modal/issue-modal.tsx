import React from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { shortAddress } from "../../../../common/utils/utils";
import PaymentView from "./payment-view";
import StatusView from "./status-view";
import WhopsView from "./whoops-view";
import Big from "big.js";
import BitcoinLogo from "../../../../assets/img/small-bitcoin-logo.png";
import { calculateAmount } from "../../../../common/utils/utils";
import { IssueRequestStatus } from "../../../../common/types/issue.types";

type IssueModalProps = {
    show: boolean;
    onClose: () => void;
};

export default function IssueModal(props: IssueModalProps) {
    const { prices } = useSelector((state: StoreType) => state.general);
    const { selectedRequest, issueRequests, address } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();
    const allRequests = issueRequests.get(address) || [];
    const request = allRequests.filter((req) => req.id === (selectedRequest ? selectedRequest.id : ""))[0];

    return (
        <Modal className="issue-modal" show={props.show} onHide={props.onClose} size={"xl"}>
            {request && (
                <React.Fragment>
                    <div className="issue-modal-title">{t("issue_page.request", { id: shortAddress(request.id) })}</div>
                    <i className="fas fa-times close-icon" onClick={props.onClose}></i>

                    <div className="issue-modal-horizontal-line"></div>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6 justify-content-center">
                                <div className="issue-amount">
                                    <span className="wizzard-number">{request.amountBTC}</span>&nbsp;BTC
                                </div>
                                <div className="row usd-price-modal">
                                    <div className="col">
                                        {"~ $" + calculateAmount(request.amountBTC || "0", prices.bitcoin.usd)}
                                    </div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("bridge_fee")}</div>
                                    <div className="col-6">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>
                                        {request.fee} BTC
                                        <div className="send-price">
                                            {"~ $" + Number(request.fee) * prices.bitcoin.usd}
                                        </div>
                                    </div>
                                </div>
                                <hr className="total-divider"></hr>
                                <div className="step-item row">
                                    <div className="col-6 total-amount">{t("total_deposit")}</div>
                                    <div className="col-6 total-amount">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>
                                        {new Big(request.fee).add(new Big(request.amountBTC)).toString()} BTC
                                        <div className="send-price">
                                            {"~ $" + Number(request.amountBTC) * prices.bitcoin.usd}
                                        </div>
                                    </div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("issue_page.destination_address")}</div>
                                    <div className="col-6">{shortAddress(request.vaultBTCAddress)}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("issue_page.parachain_block")}</div>
                                    <div className="col-6">{shortAddress(request.creation)}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("issue_page.vault_dot_address_modal")}</div>
                                    <div className="col-6">{shortAddress(request.vaultDOTAddress)}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("issue_page.vault_btc_address")}</div>
                                    <div className="col-6">{shortAddress(request.vaultBTCAddress)}</div>
                                </div>
                                <div className="row justify-content-center mt-3">
                                    <div className="col-9 note-title">{t("note")}:&nbsp;</div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-9 note-text">{t("issue_page.fully_decentralised")}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                {request &&
                                request.status !== IssueRequestStatus.Cancelled &&
                                request.status !== IssueRequestStatus.Completed ? (
                                    <PaymentView request={request} />
                                ) : (
                                    <StatusView request={request} />
                                )}
                                {false && request && <WhopsView request={request} />}
                            </div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            )}
        </Modal>
    );
}
