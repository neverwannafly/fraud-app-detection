import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useMobile } from '@app/hooks';
import history from '@app/history';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: '2rem',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '16ch',
      '&:focus': {
        width: '24ch',
      },
    },
  },
}));

function Navbar({ canGoBack }) {
  const classes = useStyles();
  const isMobile = useMobile();

  const {
    displayName, iconPath,
  } = useSelector((state) => state.users, shallowEqual);
  const handleBackClick = () => history.push('');

  return (
    <AppBar position="sticky">
      <Toolbar className="sr-container">
        { canGoBack && (
          <ArrowBackIcon
            onClick={handleBackClick}
            className="pointer m-r-10"
          />
        )}
        <Typography style={{ flexGrow: 1 }} variant="h6">
          Hi&nbsp;
          {displayName}
        </Typography>
        {!isMobile && (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Look for Apps..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        )}
        <Avatar alt="" src={iconPath} />
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  canGoBack: PropTypes.bool,
};

Navbar.defaultProps = {
  canGoBack: false,
};

export default Navbar;
