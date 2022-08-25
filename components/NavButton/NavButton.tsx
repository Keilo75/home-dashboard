import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useStyles from "./NavButton.styles";

export interface INavButton {
  icon: IconDefinition;
  label: string;
  url: string;
}

interface NavButtonProps {
  button: INavButton;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavButton: React.FC<NavButtonProps> = ({ button, setOpened }) => {
  const { classes, cx } = useStyles();
  const { pathname } = useRouter();

  const handleClick = () => setOpened(false);

  return (
    <Link href={button.url} passHref>
      <a
        onClick={handleClick}
        className={cx(
          classes.link,
          pathname === button.url && classes.linkActive
        )}
      >
        <FontAwesomeIcon icon={button.icon} className={classes.linkIcon} />
        {button.label}
      </a>
    </Link>
  );
};

export default NavButton;
