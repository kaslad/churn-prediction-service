import { NavLink as Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { FaBars } from 'react-icons/fa';
export const Nav = styled('nav')`
  background: ${({ theme }) => theme.palette.primary.main};
`;

export const NavLink = styled(Button)`
  && {
    color: ${({ theme }) => theme.palette.text.primary};
    text-decoration: none;
    padding: 0 1rem;
    &:hover {
      background-color: ${({ theme }) => theme.palette.background.default};
    }
    &.active {
      color: ${({ theme }) => theme.palette.text.primary};
      background-color: ${({ theme }) => theme.palette.background.default};
    }
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: ${({ theme }) => theme.palette.text.primary};
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled('div')`
  display: flex;
  align-items: center;
  margin-right: -24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled('nav')`
  display: flex;
  align-items: center;
  margin-right: 24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  && {
    border-radius: 4px;
    padding: 10px 22px;
    color: ${({ theme }) => theme.palette.text.primary};
    &:hover {
      background-color: ${({ theme }) => theme.palette.background.default};
    }
  }
`;