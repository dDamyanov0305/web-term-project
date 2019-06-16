import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RedirectDialog(props) {

  function handleClose(){
    props.handleDialogClose();
  }

  function handleLogin() {
    props.handleDialogClose();
    props.history.push("/signIn");
  }

  function handleSignup() {
    props.handleDialogClose();
    props.history.push("/signUp");
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>{"This action requires account ownership"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           If you'd like to take advantage of our services, please register to our platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignup} color="primary" autoFocus>
            create account
          </Button>
          <Button onClick={handleLogin} color="primary">
            log in
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}