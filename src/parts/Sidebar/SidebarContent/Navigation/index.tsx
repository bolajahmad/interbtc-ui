
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import {
  ClipboardListIcon,
  CashIcon,
  BookOpenIcon,
  RefreshIcon,
  ChartSquareBarIcon,
  ChipIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SidebarNavLink from './SidebarNavLink';
import Hr2 from 'components/hrs/Hr2';
import { INTERLAY_DOCS_LINK } from 'config/links';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import { PAGES } from 'utils/constants/links';

const NAVIGATION_ITEMS = [
  {
    name: 'nav_bridge',
    link: PAGES.BRIDGE,
    icon: RefreshIcon,
    disabled: true
  },
  {
    name: 'nav_transfer',
    link: PAGES.TRANSFER,
    icon: SwitchHorizontalIcon
  },
  {
    name: 'nav_transactions',
    link: PAGES.TRANSACTIONS,
    icon: ClipboardListIcon,
    disabled: true
  },
  {
    name: 'nav_staking',
    link: PAGES.STAKING,
    icon: CashIcon,
    disabled: true
  },
  {
    name: 'nav_dashboard',
    link: PAGES.DASHBOARD,
    icon: ChartSquareBarIcon,
    disabled: true
  },
  {
    name: 'nav_vault',
    link: PAGES.VAULT,
    icon: ChipIcon,
    disabled: true
  },
  {
    name: 'separator',
    link: '#',
    icon: () => null,
    separator: true
  },
  {
    name: 'nav_docs',
    link: INTERLAY_DOCS_LINK,
    icon: BookOpenIcon,
    external: true,
    rest: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }
];

interface CustomProps {
  onSmallScreen?: boolean;
}

// TODO: could be reused
const textClasses = clsx(
  'group',
  'flex',
  'items-center',
  'px-2',
  'py-2',
  'rounded-md'
);

const textClassesForSelected = clsx(
  { 'text-interlayDenim-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiMidnight-700':
    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const textClassesForUnselected = clsx(
  { 'text-interlayTextPrimaryInLightMode':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const textClassesForDisabled = clsx(
  { 'text-gray-500':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  { 'dark:text-gray-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
);

const navigationIconClasses = clsx(
  'flex-shrink-0',
  'w-6',
  'h-6'
);

const Navigation = ({
  onSmallScreen = false,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav
      className={clsx(
        'px-2',
        'space-y-1',
        { 'flex-1': !onSmallScreen },
        className
      )}
      {...rest}>
      {NAVIGATION_ITEMS.map(navigationItem => {
        if (navigationItem.separator) {
          return (
            <Hr2 key={navigationItem.name} />
          );
        }

        if (navigationItem.disabled) {
          return (
            <p
              className={clsx(
                textClasses,
                textClassesForDisabled,
                onSmallScreen ? 'text-base' : 'text-sm',
                'font-light'
              )}>
              <navigationItem.icon
                className={clsx(
                  textClassesForDisabled,
                  navigationIconClasses,
                  onSmallScreen ? 'mr-4' : 'mr-3'
                )}
                aria-hidden='true' />
              {t(navigationItem.name)}
            </p>
          );
        }

        const match = matchPath(location.pathname, {
          path: navigationItem.link,
          exact: true,
          strict: false
        });

        return (
          <SidebarNavLink
            key={navigationItem.name}
            external={!!navigationItem.external}
            {...navigationItem.rest}
            href={navigationItem.link}
            className={clsx(
              match?.isExact ?
                clsx(
                  textClassesForSelected,
                  { 'bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:bg-white':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ) :
                clsx(
                  textClassesForUnselected,
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ),
              onSmallScreen ? 'text-base' : 'text-sm',
              textClasses,
              'font-medium'

            )}>
            <navigationItem.icon
              className={clsx(
                match?.isExact ?
                  textClassesForSelected :
                  textClassesForUnselected,
                onSmallScreen ? 'mr-4' : 'mr-3',
                navigationIconClasses
              )}
              aria-hidden='true' />
            {t(navigationItem.name)}
          </SidebarNavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
