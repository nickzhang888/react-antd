import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { ReactBridge } from '@lego/bigbox-bridge'
import { _DvaContainer as DvaContainer, _onCreate } from '@tmp/dva'
import * as plugins from 'umi/_runtimePlugin'
import '@tmp/pollyfills'
import { setHost, getHost } from '@/utils/host'

plugins.init({
    validKeys: [
        'pathRoutes',
        'render',
        'rootContainer',
        'modifyRouteProps',
        'onRouteChange',
        'dva',
        'locale'
    ]
})
_onCreate()

const Router = require('@tmp/router').default();

class A extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <DvaContainer>
                <Router />
            </DvaContainer>
        );
    }
}

const app = {
    lifeCycles: ReactBridge({
        React,
        ReactDOM,
        rootComponent: A
    }),
    // 这个方法没写,要抄下
    setHost() { },
    dvaApp: {},

}

window.dxtaInstance = app