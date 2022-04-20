import styled from 'styled-components';
import { theme } from 'componentLibrary/theme';

const BaseCTA = styled.button`
  background-color: ${theme.colors.ctaPrimary};
  border-radius: ${theme.radius.radius1};
  color: ${theme.colors.textPrimary};
  padding: ${theme.spacing.spacing3};
`;

export const PrimaryCTA = styled(BaseCTA)``;
