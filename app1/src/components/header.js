import React,{Component} from 'react'

class Header extends Component{

    render(){

        return(<div className={'app-header'}>
            <div className={'app-site-info'}>
                <h1>SHARE</h1>
                <div className={'site-title'}>Share your files</div>
                <div className={'site-slogan'}>Secure. Fast. Free.</div>
                
            </div>
        </div>)
    }
}

export default Header;