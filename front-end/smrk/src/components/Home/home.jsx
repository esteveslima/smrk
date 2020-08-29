import React, { Component } from 'react'
import './home.css'


export default class Home extends Component {

    #audioStream = '';

    constructor(props) {
        super(props)                

        this.state = {
            
        }

    }

    getAudioStream = async () => {
        const responseIBM = await fetch(`https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/51d685e8-2da2-4027-831c-6e8233b985ef/v1/synthesize`, {
            method: "POST",
            headers: {
                'Authorization' : 'Basic '+ btoa('apikey:KEY'),     //provide KEY for auth
                'Content-Type': 'application/json',
                'Accept': 'audio/wav',                
            },
            body: JSON.stringify({                
                text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. 
                Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
                Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.`
            }),                
        })                   
        return responseIBM
    }

    playSound = async () => {        
        const responseStream = await this.getAudioStream()
        const streamReader = responseStream.body.getReader();
        //let stream = await streamReader.read();
        let stream = []
        streamReader.read().then(function processStream({done, value}){
            if(done){   
                console.log('Stream complete, playing')                  
                var blob = new Blob(stream, { type: 'audio/wav' });console.log(blob)
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


    render() {   

        const buttonPlay = (
            <div className="buttonPlay" onClick={this.playSound}>
                <span className="buttonPlayWord">Play</span>
            </div>
        )        
        
        const homeView = (
            <div className="homeView">
                {buttonPlay}
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