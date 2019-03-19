import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { db, auth, storage } from './config/FirebaseConfig';
import Body from './components/Body';
import FormBase from './components/forms/signUp/FormBase';
import SignInForm from './components/forms/signIn/SignInForm'
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{},
      books:[],
      covers:{},
    }
  }

  componentDidMount(){
    const storageRef=storage.ref();

    auth.onAuthStateChanged(user=>{
      if(user){
        console.log(user);
        db.collection('users').doc(user.uid).get().then(doc=>{
          this.setState({
            user:
              {
                ...doc.data(),
                uid:user.uid,
                avatar:user.photoURL
              }
          });
        });
        
      }
      else{
        this.setState({user});
      }
    });

    db.collection('books').orderBy('uploaded_at','desc').onSnapshot(snapshot=>{
      let updated_collection = snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));
      let new_docs = updated_collection.filter(doc=>!this.state.books.toString().includes(doc.id.toString()));

      this.setState({books:updated_collection});
      let {covers} = this.state;

      new_docs.forEach(doc=>{
        storageRef.child(`images/${doc.filename}`).getDownloadURL().then(url=>{
          covers[doc.filename] = url;
          this.setState({covers});
        })
      })
    })
  }

  render() {
    const { state, props } = this;
    console.log("rendering");
    return (
      <>
        <CssBaseline/>
        <Navbar {...props} user={state.user}>
          <Switch>
            <Route path='/signIn' component={SignInForm}/>
            <Route path='/signUp' component={FormBase}/>
            <Route path='/' render={()=>(
              <Body 
                items={state.books} 
                user={state.user} 
                covers={state.covers}
              />
            )}/>
          </Switch>
        </Navbar>
      </>
    );
  }
}

export default withRouter(App);
