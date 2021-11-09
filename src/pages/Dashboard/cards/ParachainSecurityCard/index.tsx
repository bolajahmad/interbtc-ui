
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import DashboardCard from '../DashboardCard';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';

interface Props {
  linkButton?: boolean;
}

const ParachainSecurityCard = ({ linkButton }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  const getParachainStatus = () => {
    switch (parachainStatus) {
    case ParachainStatus.Running:
      return (
        <span
          className={clsx(
            'font-bold',
            'text-interlayConifer'
          )}>
          {t('dashboard.parachain.secure')}
        </span>
      );
    case ParachainStatus.Loading:
      return (
        <span
          className={clsx(
            'font-bold',
            'text-interlayPaleSky'
          )}>
          {t('loading')}
        </span>
      );
    case ParachainStatus.Error:
    case ParachainStatus.Shutdown:
      return (
        <span
          className={clsx(
            'font-bold',
            'text-interlayCalifornia'
          )}>
          {t('dashboard.parachain.halted')}
        </span>
      );
    default:
      return (
        <span
          className={clsx(
            'font-bold',
            'text-interlayPaleSky'
          )}>
          {t('no_data')}
        </span>
      );
    }
  };

  return (
    <DashboardCard>
      <div
        className={clsx(
          'h-64',
          'grid',
          'place-items-center'
        )}>
        <div>
          <h1
            className={clsx(
              'font-bold',
              'text-3xl',
              'text-left'
            )}>
            {t('dashboard.parachain.parachain_is', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}&nbsp;
            {getParachainStatus()}
          </h1>
          {linkButton && (
            <InterlayRouterLink to={PAGES.DASHBOARD_PARACHAIN}>
              <InterlayConiferOutlinedButton endIcon={<FaExternalLinkAlt />}>
                STATUS UPDATES
              </InterlayConiferOutlinedButton>
            </InterlayRouterLink>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default ParachainSecurityCard;