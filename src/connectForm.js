const React = require('react');
const {PropTypes} = React;
const {connect, connectAdvanced} = require('react-redux');
const util = require('./util');
const _ = require('lodash');
const {compose, mapProps, getContext, withContext, lifecycle} = require('recompose');
const namespace = require('./namespace');
const actions = require('./actionCreators');
const ShortId = require('shortid');
const { createSelector } = require('reselect');

const stateGetter = (s,p) => _.get(s, [namespace, p.id], {});

function mapStateToProps(state, props) {
    const dataSelector = createSelector(stateGetter, state => _.get(state, 'data', {}));

    return (state, props) => ({
        data: dataSelector(state, props),
    });
}

function mapDispatchToProps(dispatch, {id,form}) {
    return {
        validate: () => { // FIXME: not sure if this should trigger a submit or not....
            dispatch(actions.submit(id));
            return Array.from(form.fields.values()).every(f => f.props.ui.isValid);
        },
    };
}

const contextTypes = {
    form: PropTypes.object,
};

function connectForm({rules}) {
    return compose(
        withContext(
            contextTypes,
            props => ({
                form: {
                    id: props.id || ShortId.generate(),
                    rules: rules ? util.unflatten(rules) : {},
                    fields: new Map(),
                },
            })
        ),
        getContext(contextTypes),
        connect(mapStateToProps, mapDispatchToProps)
    );
}


module.exports = connectForm;