import React, { Component } from 'react';
import StepperForm from './StepperForm'
import { auth, db, storage } from '../../../config/FirebaseConfig'

class FormBase extends Component{
    state={
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        avatar: false,
        color:'',
        image:'',
        file:'',
        addressLine1: '',
        addressLine2: '',
        city: '',
        region: '',
        zip: '',
        country: '',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        const { password, image, avatar, file, color, ...rest} = this.state;
        let values={};
        auth
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(cred=>{
                if(avatar){
                    let uploadTask = storage.ref().child('avatars/'+cred.user.uid).put(this.state.file)
                    uploadTask.on('state_changed', snapshot => {
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                      }, function(error) {
                        console.log(error);
                      }, () => {
                        
                        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                          cred.user.updateProfile({
                            photoURL:downloadURL,
                            displayName:`${rest.firstName} ${rest.lastName}`
                          })
                          .catch(error=>{console.log(error)});
                        });
                      });

                    this.props.history.push('/');
                    values={...rest,basket:null,purchased:null,}
                }
                else{
                    values={...rest,basket:null,purchased:null,color}
                }
                db.collection("users").doc(cred.user.uid).set(values)
                
            })
            .catch(error=>{
                alert(error);
            });
    };

    handleChange = (e) =>{
        this.setState({[e.target.name]:e.target.value});
    }

    handleImageChange=(avatarArgs)=>{
        this.setState({...avatarArgs});
    }
    render(){
        return <StepperForm state={this.state} handleImageChange={this.handleImageChange} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>;
    }

}

export default FormBase;