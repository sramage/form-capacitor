import React from 'react';
import monaco from '../monaco';
import styled from 'styled-components';
import '../optimizedResize';
import addEventListener from '../addEventListener';

const Container = styled.div`
    width: 100%;
    height: 100%;
`


// https://microsoft.github.io/monaco-editor/monarch.html

export default class MonacoEditor extends React.Component {

    componentDidMount() {
        this.editor = monaco.editor.create(this.el, {
            value: this.props.defaultValue,
            minimap: {
                enabled: false
            },
            language: this.props.language,
            folding: false,
            fontFamily: `"SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace`,
            fontSize: '12px',
            lineHeight: '18px',
            scrollBeyondLastLine: false,
            theme: 'vs-dark',
        });
        if(this.props.onChange) {
            this.editor.onDidChangeModelContent(ev => {
                const value = this.editor.getValue();
                this.props.onChange.call(this.editor, {...ev, value});
            });
        }
        this.unsubResize = window::addEventListener('optimizedResize', () => {
            this.editor.layout();
        })
    }
    
    layout = () => {
        this.editor.layout();
    }
    
    componentDidUpdate() {
        this.editor.layout();
    }

    componentWillUnmount() {
        this.unsubResize();
        this.editor.dispose();
    }

    render() {
        return <Container innerRef={n => this.el = n}/>
    }
}