import { FixedPointNumber } from '@acala-network/sdk-core';
import { CrossChainTransferParams } from '@interlay/bridge';
import { DefaultTransactionAPI } from '@interlay/interbtc-api';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import Big from 'big.js';
import * as React from 'react';
import { useEffect } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { firstValueFrom } from 'rxjs';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CoinIcon } from '@/component-library';
import Accounts from '@/components/Accounts';
import AvailableBalanceUI from '@/components/AvailableBalanceUI';
import Chains, { ChainOption } from '@/components/Chains';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TokenField from '@/components/TokenField';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
};

const CrossChainTransferForm = (): JSX.Element => {
  const [fromChains, setFromChains] = React.useState<Array<ChainOption> | undefined>(undefined);
  const [fromChain, setFromChain] = React.useState<ChainOption | undefined>(undefined);
  const [toChains, setToChains] = React.useState<Array<ChainOption> | undefined>(undefined);
  const [toChain, setToChain] = React.useState<ChainOption | undefined>(undefined);
  const [transferableBalance, setTransferableBalance] = React.useState<any>(undefined);
  const [destination, setDestination] = React.useState<KeyringPair | undefined>(undefined);
  // const [destinationBalance, setDestinationBalance] = React.useState<any>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

  const [currency, setCurrency] = React.useState<any>(undefined);

  // TODO: this will need to be refactored when we support multiple currencies
  // per channel, but so will the UI so better to handle this then.
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const { XCMBridge, XCMProvider } = useXCMBridge();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const { selectedAccount } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    if (!XCMBridge) return;
    if (!fromChain) return;
    if (!toChain) return;
    // TODO: This handles a race condition. Will need to be fixed properly
    // when supporting USDT
    if (fromChain.name === toChain.name) return;

    const tokens = XCMBridge.router.getAvailableTokens({ from: fromChain.type, to: toChain.type });

    const supportedCurrency = XCMBridge.findAdapter(fromChain.type).getToken(tokens[0], fromChain.type);

    setCurrency(supportedCurrency);
  }, [fromChain, toChain, XCMBridge]);

  useEffect(() => {
    if (!XCMBridge) return;
    if (!fromChain) return;
    if (!selectedAccount) return;
    if (!currency) return;

    const getBalance = async () => {
      const balance: any = await firstValueFrom(
        XCMBridge.findAdapter(fromChain.type).subscribeTokenBalance(currency.symbol, selectedAccount.address)
      );

      setTransferableBalance(balance.free);
    };

    getBalance();
  }, [currency, fromChain, selectedAccount, XCMBridge]);

  useEffect(() => {
    if (!XCMBridge) return;
    if (!XCMProvider) return;

    const availableFromChains: Array<ChainOption> = XCMBridge.adapters.map((adapter: any) => {
      return {
        type: adapter.chain.id,
        name: adapter.chain.id,
        icon: <CoinIcon coin={adapter.balanceAdapter.nativeToken} size='small' />
      };
    });

    setFromChains(availableFromChains);
    setFromChain(availableFromChains[0]);
  }, [XCMBridge, XCMProvider]);

  useEffect(() => {
    if (!XCMBridge) return;
    if (!fromChain) return;

    const destinationChains = XCMBridge.router.getDestinationChains({ from: fromChain.type });

    const availableToChains = destinationChains.map((chain: any) => {
      const adapter = XCMBridge.findAdapter(chain.id) as any;

      return {
        type: chain.id,
        name: chain.id,
        icon: <CoinIcon coin={adapter.balanceAdapter.nativeToken} size='small' />
      };
    });

    setToChains(availableToChains);
    setToChain(availableToChains[0]);
  }, [fromChain, XCMBridge]);

  const onSubmit = async (data: CrossChainTransferFormData) => {
    if (!selectedAccount) return;
    if (!destination) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      if (!XCMBridge || !fromChain || !toChain) return;

      const sendTransaction = async () => {
        const { signer } = await web3FromAddress(selectedAccount.address.toString());

        const adapter = XCMBridge.findAdapter(fromChain.type);

        const apiPromise = (XCMProvider.getApiPromise(fromChain.type) as unknown) as ApiPromise;

        apiPromise.setSigner(signer);

        // TODO: Version mismatch with ApiPromise type. This should be inferred.
        adapter.setApi(apiPromise as any);

        const transferAmount = new MonetaryAmount(currency, data[TRANSFER_AMOUNT]);
        const transferAmountString = transferAmount.toString(true);
        const transferAmountDecimals = transferAmount.currency.decimals;

        // TODO: Transaction is in promise form
        const tx: any = adapter.createTx({
          amount: FixedPointNumber.fromInner(transferAmountString, transferAmountDecimals),
          to: toChain.type,
          token: currency.symbol,
          address: destination.address
        } as CrossChainTransferParams);

        await DefaultTransactionAPI.sendLogged(apiPromise, selectedAccount.address, tx);
      };

      await sendTransaction();

      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedAccount) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  const handleUpdateUsdAmount = (value: string) => {
    if (!value) return;

    const tokenAmount = newMonetaryAmount(value, currency, true);

    const usd = displayMonetaryAmountInUSDFormat(tokenAmount, getTokenPrice(prices, currency.symbol)?.usd);

    setApproxUsdValue(usd);
  };

  const validateTransferAmount = async (value: string) => {
    if (!toChain) return;
    if (!destination) return;
    if (!selectedAccount) return;

    const balanceMonetaryAmount = newMonetaryAmount(transferableBalance, currency, true);
    const transferAmount = newMonetaryAmount(value, currency, true);

    const inputConfigs = await firstValueFrom(
      XCMBridge.findAdapter(toChain.type).subscribeInputConfigs({
        to: toChain?.type,
        token: currency.symbol,
        address: destination.address,
        signer: selectedAccount.address
      })
    );

    const minInputToBig = Big(inputConfigs.minInput.toString());
    const maxInputToBig = Big(inputConfigs.maxInput.toString());

    if (minInputToBig.gt(transferAmount.toBig())) {
      return 'Must transfer more than [minInput] more: ed, fees etc';
    } else if (maxInputToBig.lt(transferAmount.toBig())) {
      return 'Must be less than [maxInput]';
    } else if (balanceMonetaryAmount.lt(transferAmount)) {
      return t('insufficient_funds');
    } else {
      return undefined;
    }
  };

  const handleSetFromChain = (chain: ChainOption) => {
    setFromChain(chain);
  };

  const handleClickBalance = () => {
    setValue(TRANSFER_AMOUNT, transferableBalance);
    handleUpdateUsdAmount(transferableBalance);
    trigger(TRANSFER_AMOUNT);
  };

  // This ensures that triggering the notification and clearing
  // the form happen at the same time.
  React.useEffect(() => {
    if (submitStatus !== STATUSES.RESOLVED) return;

    toast.success(t('transfer_page.successfully_transferred'));

    reset({
      [TRANSFER_AMOUNT]: ''
    });
  }, [submitStatus, reset, t]);

  if (!XCMBridge) {
    return <PrimaryColorEllipsisLoader />;
  }

  const availableBalanceLabel = 'Available balance';

  return (
    <>
      {currency && (
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{t('transfer_page.cross_chain_transfer_form.title')}</FormTitle>
          <div>
            <AvailableBalanceUI
              label={availableBalanceLabel}
              balance={transferableBalance?.toString() || '0'}
              tokenSymbol={currency.symbol}
              onClick={handleClickBalance}
            />
            <TokenField
              id={TRANSFER_AMOUNT}
              {...register(TRANSFER_AMOUNT, {
                onChange: (e) => handleUpdateUsdAmount(e.target.value),
                required: {
                  value: true,
                  message: t('transfer_page.cross_chain_transfer_form.please_enter_amount')
                },
                validate: (value) => validateTransferAmount(value)
              })}
              error={!!errors[TRANSFER_AMOUNT]}
              helperText={errors[TRANSFER_AMOUNT]?.message}
              label={currency.symbol}
              approxUSD={`≈ ${approxUsdValue}`}
            />
          </div>
          <Chains
            chainOptions={fromChains}
            label={t('transfer_page.cross_chain_transfer_form.from_chain')}
            selectedChain={fromChain}
            onChange={handleSetFromChain}
          />
          <Chains
            chainOptions={toChains}
            label={t('transfer_page.cross_chain_transfer_form.to_chain')}
            selectedChain={toChain}
          />
          <Accounts
            label={t('transfer_page.cross_chain_transfer_form.target_account')}
            callbackFunction={setDestination}
          />
          <SubmitButton
            disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}
          >
            {selectedAccount ? t('transfer') : t('connect_wallet')}
          </SubmitButton>
        </form>
      )}
      {submitStatus === STATUSES.REJECTED && submitError && (
        <ErrorModal
          open={!!submitError}
          onClose={() => {
            setSubmitStatus(STATUSES.IDLE);
            setSubmitError(null);
          }}
          title='Error'
          description={typeof submitError === 'string' ? submitError : submitError.message}
        />
      )}
    </>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
