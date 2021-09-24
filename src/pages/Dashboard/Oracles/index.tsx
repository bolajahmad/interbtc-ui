
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import OracleStatus from '../components/oracle-status';
import OracleTable from './OracleTable';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

const Oracles = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.oracles.oracles')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayDenim',
            'mt-2'
          )} />
      </div>
      <OracleStatus />
      <OracleTable />
    </MainContainer>
  );
};

export default Oracles;
