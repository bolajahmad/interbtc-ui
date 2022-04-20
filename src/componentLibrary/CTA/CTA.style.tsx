import styled from 'styled-components';
import { theme } from 'componentLibrary';

interface CTAProps {
  fullWidth: boolean;
}

const BaseCTA = styled.button<CTAProps>`
  color: ${theme.colors.textPrimary};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing3};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

export const PrimaryCTA = styled(BaseCTA)`
  color: ${theme.colors.textPrimary};
`;

export const SecondaryCTA = styled(BaseCTA)`
  background-color: ${theme.colors.ctaSecondary};
`;
