import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useStyles from './NavButton.styles';

export interface NavButtonProps {
  icon: IconDefinition;
  label: string;
  url: string;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, url }) => {
  const { classes, cx } = useStyles();
  const { pathname } = useRouter();

  return (
    <Link href={url} passHref>
      <a className={cx(classes.link, pathname === url && classes.linkActive)}>
        <FontAwesomeIcon icon={icon} className={classes.linkIcon} />
        {label}
      </a>
    </Link>
  );
};

export default NavButton;
