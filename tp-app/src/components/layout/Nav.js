import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Home from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles=theme=>({
    appBar: {
        boxShadow: 'none',
        backgroundColor: '#fafafa',
        color:'black',
        borderBottom:'1px solid rgb(200, 200, 200)',
        padding:'0 60px'
      },
      grow: {
        flexGrow: 1,
      },
      button: {
        margin: theme.spacing.unit,
        boxShadow: 'none'
      },
      title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit,
          width: 'auto',
        },
      },
      searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
        width: '100%',
      },
      inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 120,
          '&:focus': {
            width: 320,
          },
        },
      },
      sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
      },
      sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
      },
});


const Nav = props =>{

    const { classes, history, user, isMenuOpen } = props;
    const isUserPresent=Boolean(user);
    if(user!==null && user.requests!==undefined){
      var notifications=user.requests.filter(req=>!req.seen).length;
    }

    return(
      <Grid item xs={10}>
        <AppBar 
          position="fixed" 
          className={classes.appBar}
        >
          <Toolbar>

            {
              isUserPresent&&
              <IconButton 
                color="inherit" 
                aria-label="Open drawer"
                onClick={props.toggleDrawer}  
              >
                <MenuIcon />
              </IconButton>
            }
            
            <Typography className={classes.title} variant="h6" color="inherit">Book Marketplace</Typography>

            <div className={classes.grow} />

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            

            {isUserPresent?
            (<div className={classes.sectionDesktop}>
              <IconButton color="inherit" onClick={()=>{history.push('/')}}>
                <Home />
              </IconButton>
              <IconButton color="inherit">
                <MailIcon />
              </IconButton>
              <IconButton color="inherit" onClick={()=>{history.push('/requests')}}>
                {
                  (notifications!==0)?
                  (<Badge badgeContent={notifications} color="secondary">
                    <NotificationsIcon />
                  </Badge>):
                  (<NotificationsIcon/>)
                }
                
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={props.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>):  
            (<div className={classes.sectionDesktop}>
              <Button onClick={()=>{history.push('/signIn')}} className={classes.button}>
                Log In     
              </Button>
              <Button onClick={()=>{history.push('/signUp')}} variant="outlined" className={classes.button}>
                Sign Up
              </Button>
            </div>)}
              
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={props.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>

          </Toolbar>
        </AppBar>
        </Grid>
    );
}

Nav.propTypes={
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Nav);