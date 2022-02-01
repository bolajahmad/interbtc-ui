
import clsx from 'clsx';

import InterlayDenimOrKintsugiMidnightContainedButton, {
  Props as InterlayDenimOrKintsugiMidnightContainedButtonProps
} from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

const UnstakeButton = ({
  className,
  ...rest
}: InterlayDenimOrKintsugiMidnightContainedButtonProps): JSX.Element => (
  <InterlayDenimOrKintsugiMidnightContainedButton
    className={clsx(
      'w-full',
      'px-6',
      'py-3',
      'text-base',
      'rounded-md',
      className
    )}
    endIcon={
      <InterlayTooltip label='tooltip'>
        <InformationCircleIcon
          onClick={event => {
            event.stopPropagation();
          }}
          className={clsx(
            'pointer-events-auto',
            'w-5',
            'h-5'
          )} />
      </InterlayTooltip>
    }
    disabled
    {...rest}>
    Unstake Locked {GOVERNANCE_TOKEN_SYMBOL} 24/12/2022
  </InterlayDenimOrKintsugiMidnightContainedButton>
);

export default UnstakeButton;
