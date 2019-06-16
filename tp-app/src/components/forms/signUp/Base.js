import React, { Component } from 'react';
import CStepper from './CStepper';
import { auth, db, storage } from '../../../config/FirebaseConfig';

class Base extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password1: '',
            password2: '',
            image: '',
            file: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            region: '',
            postalCode: '',
            country: '',
            message: '',
        }
    }
    

    handleSubmit = (e) => {
        const { password1, password2, image, file, message, ...userData } = this.state;

        if(password1!==password2){
            this.setState({message:"passwords must match"});
        } else{
            auth
                .createUserWithEmailAndPassword(userData.email, password1)
                .then(cred=>{
                    auth.currentUser.sendEmailVerification().then(()=>{
                        db.collection("users").doc(cred.user.uid).set(userData);
                        if(file!==''){
                            storage.ref().child('avatars/'+cred.user.uid).put(file).then(snapshot=>{
                                snapshot.ref.getDownloadURL().then(url=>{
                                    db.collection("users").doc(cred.user.uid).update({url});
                                })
                            });
                           
                        } 
                        
                    })
                    
                    /*data.uid=cred.user.uid;
                    console.log(data);
                    fetch("http://localhost:5000/create_user",{
                        method:"POST",
                        mode:"no-cors",
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(data)
                    }).then(response=>{console.log(response)});*/
                    
                })
                .catch(err=>{this.setState({message:err.message})});
                setTimeout(()=>{this.props.history.push('/');},3500);
        }
            
    }

    handleChange = (e) =>{
        if(e.target.name==="file"){
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend=()=>{
                this.setState({ file, image : reader.result });
            }

            if(file){
                reader.readAsDataURL(file);
            }
            
        }
        else{
            this.setState({[e.target.name]:e.target.value});
        }
    }


    render(){
        return <CStepper state={this.state} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>;
    }

}

export default Base;