
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import WrappedTokenCard from './WrappedTokenCard';
import CollateralLockedCard from '../CollateralLockedCard';
import CollateralizationCard from '../CollateralizationCard';
import ParachainSecurityCard from '../ParachainSecurityCard';
import BTCRelayCard from '../BTCRelayCard';
import OracleStatusCard from '../OracleStatusCard';
import ActiveVaultsCard from '../ActiveVaultsCard';
import ActiveCollatorsCard from './ActiveCollatorsCard';

const Home = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle
        mainTitle={t('dashboard.dashboard')}
        subTitle={<TimerIncrement />} />
      <div
        className={clsx(
          'grid',
          'gap-5',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:gap-10',
          'xl:grid-cols-3'
        )}>
        <WrappedTokenCard />
        <CollateralLockedCard linkButton />
        <CollateralizationCard linkButton />
        <ParachainSecurityCard linkButton />
        <BTCRelayCard linkButton />
        <OracleStatusCard linkButton />
        <ActiveVaultsCard linkButton />
        <ActiveCollatorsCard />
      </div>
    </>
  );
};

export default Home;
