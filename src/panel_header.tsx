import styles from './panel_header.module.css';
import classNames from 'classnames';
import { HStack } from '@tcn/ui-layout';

export interface PanelHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PanelHeader({ children, className, style }: PanelHeaderProps) {
  return (
    <HStack height='auto' verticalAlignment='center' className={classNames(styles['panel-header'], className)} style={style}>
      {children}
    </HStack>
  );
}
