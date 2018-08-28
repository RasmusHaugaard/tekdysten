import React, { Component } from 'react';

import MuiButton from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import firebase from 'firebase';

class PlayerChooseStudy extends Component {
  constructor(props){
    super(props);
    this.state = {selectedStudy: null};
  }

  select(study){
    this.setState({
      selectedStudy: study,
      selectedStudyName: this.props.studies[study].displayName,
    });
  }

  confirm(study){
    firebase.database().ref('users').child(this.props.user.uid).child('study').set(study);
  }

  render(){
    const studies = this.props.studies;
    const listItems = Object.keys(studies).sort().map(study => {
      return <ListItem key={study} button onClick={() => this.select(study)}>
        <ListItemText primary={studies[study].displayName}/>
      </ListItem>;
    });

    const selectedStudy = this.state.selectedStudy;

    return (
      <div>
        Select your study.
        <List>
          {listItems}
        </List>
        <Dialog open={selectedStudy ? true : false}>
          <DialogTitle>{this.state.selectedStudyName + '?'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You cannot change your selected study. Make sure it is right.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => this.setState({selectedStudy: null})}>Cancel</MuiButton>
            <MuiButton onClick={() => this.confirm(selectedStudy)} autoFocus>OK</MuiButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default PlayerChooseStudy;
