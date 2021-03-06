import React from "react"
import { Subject } from "rxjs"

React.Component.store = []
export class AssignRxComponent extends React.Component {  
    syncSetState = (state) => {
        const me = this
        return new Promise(function(reslove) {
            me.setState(state, () => {
                reslove(me.state)
            })
        })
    }
    
    dispatch = async (action) => {
        for(let re of AssignRxComponent.store) {
            await re(action)
        }
    }

    createStore(...rest) {
        let l = 2
        while(l > 0 && rest.length > 0) {
            let arg = rest.shift()
            if(typeof arg === 'object') {
                Object.keys(arg).map((key) => {
                    const subject = new Subject()
                    this[key] = function() {
                        subject.next(arguments[0])
                        return subject
                    }
                    arg[key].call(this, subject, this.dispatch)
                })
            } else if(typeof arg === 'function') {
                this.storeIndex =  AssignRxComponent.store.push( async (action) => {
                    await arg.call(this, action, this.syncSetState)
                } ) - 1
            }
            l--
        }
    }

    componentWillUnmount = () => {
        AssignComponent.store.splice(this.storeIndex, 1)
    }
} 

