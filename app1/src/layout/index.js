import React, { Component } from 'react'
import Header from '../components/header'
class Layout extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={'app-layout'}>
                <div className={'app-container'}>
                        <Header/>

                    <div className={'app-content'}>
                        app cont
                    </div>
                </div>
                
            </div>
        )
    }
}
        
export default Layout;