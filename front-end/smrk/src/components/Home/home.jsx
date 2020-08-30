import { Input, Button, List } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import './home.css'

const { TextArea } = Input;

export default class Home extends Component {
    constructor(props) {
        super(props)                

        this.state = {
            commentsRegistered: [
                'Lorem ipsum dolor sit amet',
                'Aliquam nonummy auctor massa',
                'Nulla at risus'
            ],

            fieldRegisterComment: '',
            loadingRegister: false
        }

    }

    getAudioStream = async (comment) => {        
        const responseIBM = await fetch(`{URL}/v1/synthesize`, {
            method: "POST",
            headers: {
                'Authorization' : 'Basic '+ btoa('apikey:{KEY}'),     //provide the URL and KEY for auth
                'Content-Type': 'application/json',
                'Accept': 'audio/wav',                
            },
            body: JSON.stringify({                
                text: comment
            }),
                     
        })                  
                
        return responseIBM
    }

    playSound = async (comment) => {        
        const responseStream = await this.getAudioStream(comment)
        const streamReader = responseStream.body.getReader();
        //let stream = await streamReader.read();
        let stream = []
        streamReader.read().then(function processStream({done, value}){
            if(done){   
                console.log('Stream complete, playing')                  
                var blob = new Blob(stream, { type: 'audio/wav' });
                var url = window.URL.createObjectURL(blob)        
                window.audio = new Audio();
                window.audio.src = url;                            
                window.audio.play()                    
                return;
            }else{
                console.log('Reading stream')
                stream.push(value);
                return streamReader.read().then(processStream);
            }
        })
        
        return
    }


    registerComment = async () => {     
        this.setState({
            loadingRegister: true
        })   
        /*const responseRegister = await fetch(``, {
            method: "POST",
            headers: {
                //'Authorization' : ''
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({
                comment: this.state.fieldRegisterComment
            }),    

            if(responseRegister.status === 200){}
        })*/      

        this.setState({
            commentsRegistered: [...this.state.commentsRegistered, this.state.fieldRegisterComment],
            fieldRegisterComment: '',
            loadingRegister: false
        })
    }


    render() {   

        const registerComment = (
            <div className="registerComment" style={{position: 'absolute', top: '10%', left: '5%', width: '45%', height: '70%', borderStyle: 'solid', borderWidth: 1}}>
                <span style={{position: 'absolute', top: '10%', left: '5%', fontSize: 25}}>Insira um novo comentário</span>
                <TextArea rows={10} 
                    style={{position: 'absolute', top: '15%', left: '5%', width: '80%', height: '50%'}} 
                    onChange={(value) => this.setState({ fieldRegisterComment: value.target.value })}
                    value={this.state.fieldRegisterComment}
                />
                <Button className="buttonRegisterComment" type="primary"
                    style={{position: 'absolute', bottom: '10%', left: '5%', backgroundColor: '#333', borderColor: '#333', color: '#fff', fontSize: 20}}
                    loading={this.state.loadingRegister}
                    onClick={() => this.registerComment()}
                >
                    Cadastrar
                </Button>
            </div>
        )

        const commentsList = (
            <div className="commentsList" style={{position: 'absolute', top: '10%', right: '5%', width: '45%', height: '70%', borderStyle: 'solid', borderWidth: 1}}>
                <span style={{position: 'absolute', top: '10%', right: '5%', fontSize: 25}}>Comentários cadastrados</span>
                <List
                    itemLayout="horizontal"
                    style={{position: 'absolute', top: '15%', right: '5%', width: '90%'}}
                    dataSource={this.state.commentsRegistered}
                    renderItem={item => (
                    <List.Item>
                        <div>
                            <div style={{height: 80, float: 'left', width: '85%', borderStyle: 'solid', borderWidth: 1}}>
                                <span>{item}</span>
                            </div>  
                            <div style={{height: 80, float: 'right', width: '10%', borderStyle: 'solid', borderWidth: 1}}>
                                <PlayCircleOutlined style={{fontSize: 40, cursor: 'pointer'}} twoToneColor="#947119" spin={this.state.commentBeingPlayed}
                                    onClick={() => this.playSound(item)}
                                />
                            </div>                             
                        </div>                                            
                    </List.Item>
                    )}
                />
            </div>
        )
    
        const homeView = (
            <div className="homeView">
                {registerComment}                
                {commentsList} 
            </div>
        )

        return (
            <div id="homePage">
                {
                    homeView
                }                
            </div>
        )
    }
}