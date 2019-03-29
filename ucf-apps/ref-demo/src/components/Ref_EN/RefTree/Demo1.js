/**
 *
 * @title ref-tree 参照_en-树形_en
 * @description 具有单选多选的树形参照_en
 *
 */

import React, { Component } from 'react';
// import RefTreeWithInput   from 'pap-refer/lib/ref-tree.js'; 
// import "pap-refer/lib/ref-tree.css";
import PapReferOrg from 'pap-refer/lib/pap-ref-org';
import 'pap-refer/lib/pap-ref-org.css';
import { Button, Form } from 'tinper-bee';
import Card from '../Card'
let code =
  `
class Demo1 extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    }

  }
  render() {

    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Card
        title="基础示例_en"
        codeText={code}
        footer={
          <Button colors="primary"
            style={{
              margin: 'auto 5px',
              height: '30px',
              padding: '0px'
            }}
            onClick={() => {
              this.props.form.validateFields((err, values) => {
                if (err) return;
                alert("您选择的是_en"+JSON.stringify(values))
              });
            }}
          >
            提交_en
          </Button>
        }
      >
        <div className="demo-label">
          <span >单选（组织）：_en</span>
          <PapReferOrg
            multiple={false}
            searchable={true}
            checkStrictly={true}
            strictMode={true}
            displayField='{refname}'
            nodeDisplay='{refname}'
            valueField='refpk'
            lang={this.props.lang}
            emptyBut={true}
            {...getFieldProps('code', {
              initialValue: '{"refname":"","refpk":""}',
              rules: [{
                message: '提示：请选择组织_en',
                pattern: /[^{"refname":"","refpk":""}|{"refpk":"","refname":""}]/
              }]
            })}
          />
        </div>
        <div className="demo-label">
          <span >多选（组织）：_en</span>
          <PapReferOrg
            multiple={true}
            searchable={true}
            checkStrictly={true}
            strictMode={true}
            displayField='{refname}'
            nodeDisplay='{refname}'
            valueField='refpk'
            lang={this.props.lang} emptyBut={true}
            {...getFieldProps('code2', {
              initialValue: '{"refname":"","refpk":""}',
              rules: [{
                message: '提示：请选择组织_en',
                pattern: /[^{"refname":"","refpk":""}|{"refpk":"","refname":""}]/
              }]
            })}
          />
        </div>
      </Card>
    )
  }
};
`
class Demo1 extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    }

  }
  render() {

    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Card
        title="基础示例_en"
        codeText={code}
        footer={
          <Button colors="primary"
            style={{
              margin: 'auto 5px',
              height: '30px',
              padding: '0px'
            }}
            onClick={() => {
              this.props.form.validateFields((err, values) => {
                if (err) return;
                alert("您选择的是_en"+JSON.stringify(values))
              });
            }}
          >
            提交_en
          </Button>
        }
      >
        <div className="demo-label">
          <span >单选（组织）：_en</span>
          <PapReferOrg
            multiple={false}
            searchable={true}
            checkStrictly={true}
            strictMode={true}
            displayField='{refname}'
            nodeDisplay='{refname}'
            valueField='refpk'
            lang={this.props.lang}
            emptyBut={true}
            {...getFieldProps('code', {
              initialValue: '{"refname":"","refpk":""}',
              rules: [{
                message: '提示：请选择组织_en',
                pattern: /[^{"refname":"","refpk":""}|{"refpk":"","refname":""}]/
              }]
            })}
          />
          <span style={{
            color: 'red'
          }}>
            {
              getFieldError('code')
            }
          </span>
        </div>
        <div className="demo-label">
          <span >多选（组织）：_en</span>
          <PapReferOrg
            multiple={true}
            searchable={true}
            checkStrictly={true}
            strictMode={true}
            displayField='{refname}'
            nodeDisplay='{refname}'
            valueField='refpk'
            lang={this.props.lang} emptyBut={true}
            {...getFieldProps('code2', {
              initialValue: '{"refname":"","refpk":""}',
              rules: [{
                message: '提示：请选择组织_en',
                pattern: /[^{"refname":"","refpk":""}|{"refpk":"","refname":""}]/
              }]
            })}
          />
          <span style={{
            color: 'red'
          }}>
            {
              getFieldError('code2')
            }
          </span>
        </div>
      </Card>
    )
  }
};

export default Form.createForm()(Demo1);