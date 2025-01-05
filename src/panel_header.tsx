import { Header } from '@tcn/ui-core';
import styles from './panel_header.module.css';
import classNames from 'classnames';

export interface PanelHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PanelHeader({ children, className, style }: PanelHeaderProps) {
  return (
    <div className={classNames(styles['panel-header'], className)} style={style}>
      {children}
    </div>
  );
}
