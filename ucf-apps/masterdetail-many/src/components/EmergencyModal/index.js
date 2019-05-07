import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, {Component} from "react";
import {actions} from "mirrorx";
import {FormControl} from "tinper-bee";
import PopDialog from 'components/Pop';
import FormError from 'components/FormError';
import FormControlPhone from 'components/FormControlPhone';
import FormList from 'components/FormList';
import './index.less'

const FormItem = FormList.Item;
let titleArr = [<FormattedMessage id="js.com.Eme.0001" defaultMessage="新增" />, <FormattedMessage id="js.com.Eme.0002" defaultMessage="修改" />, <FormattedMessage id="js.com.Eme.0003" defaultMessage="详情" />];

class AddEditEmergency extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            btnFlag: 0,
        }
    }

    async componentWillReceiveProps(nextProps) {
        let {btnFlag, currentIndex} = this.props;
        let {btnFlag: nextBtnFlag, currentIndex: nextCurrentIndex, emergencyObj, checkTable, modalVisible} = nextProps;
        if (btnFlag !== nextBtnFlag || currentIndex !== nextCurrentIndex) {
            // 防止网络阻塞造成btnFlag显示不正常
            this.setState({btnFlag: nextBtnFlag});
            let rowData = {};
            try {
                // 判断是否从后端获取新数据
                if (nextBtnFlag !== 0 && checkTable === "emergency" && modalVisible) {
                    this.props.form.resetFields();
                    let {list} = emergencyObj;
                    rowData = list[nextCurrentIndex] || {};
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setState({rowData});
            }
        }
    }


    /**
     * button关闭Modal 同时清空state
     * @param {Boolean} isSave 判断是否添加或者更新
     */
    onCloseEdit = (isSave) => {
        this.setState({rowData: {}, btnFlag: 0});
        this.props.form.resetFields();
        this.props.onCloseModal(isSave);
    }

    /**
     * 提交信息
     * @returns {Promise<void>}
     */
    onSubmitEdit = async () => {
        const _this = this;
        let { btnFlag }=_this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let {passengerIndex, passengerObj} = this.props;
                let {list} = passengerObj;
                let {id: passengerId} = list[passengerIndex]; //获取父亲节点的id
                let {rowData} = _this.state;
                if (rowData && rowData.id) { // 如果是编辑，带上节点 id
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.passengerId = passengerId;
                values.btnFlag=btnFlag;
                _this.onCloseEdit(true); // 关闭弹框 无论成功失败
                this.props.resetIndex('emergencyIndex'); //重置state， 默认选中第一条
                actions.masterDetailMany.saveEmergency(values); //保存主表数据
            }

        });
    }


    /**
     *
     * @description 底部按钮是否显示处理函数
     * @param {Number} btnFlag 为页面标识
     * @returns footer中的底部按钮
     */
    onHandleBtns = (btnFlag) => {

        let btns = [

            {
                label: <FormattedMessage id="js.com.Eme.0004" defaultMessage="取消" />,
                fun: this.onCloseEdit,
                shape: 'border'
            },
            {
                label: <FormattedMessage id="js.com.Eme.0005" defaultMessage="确定" />,
                fun: this.onSubmitEdit,
                colors: 'primary'
            },
        ];

        if (btnFlag == 2) {
            btns = [];
        }
        return btns;
    }

    // 通过search_id查询数据
    render() {

        let {form, modalVisible} = this.props;
        let {getFieldProps, getFieldError} = form;
        let {rowData, btnFlag} = this.state;
        let {contactRelation, contactName, contactPhone, remark} = rowData;
        let btns = this.onHandleBtns(btnFlag);

        return (
            <PopDialog
                show={modalVisible}
                size='lg'
                close={this.onCloseEdit}
                title={titleArr[btnFlag]}
                btns={btns}
                className='emergency-modal'
            >

                <FormList>
                    <FormItem required label={<FormattedMessage id="js.com.Eme.0006" defaultMessage="联系人姓名" />}>
                        <FormControl disabled={btnFlag > 0} maxLength={20}
                                     {...getFieldProps('contactName', {
                                         validateTrigger: 'onBlur',
                                         initialValue: contactName || '',
                                         rules: [{
                                             type: 'string',
                                             required: true,
                                             pattern: /\S+/ig,
                                             message: <FormattedMessage id="js.com.Eme.0007" defaultMessage="请输入联系人姓名" />,
                                         }],
                                     })}
                        />
                        <FormError errorMsg={getFieldError('contactName')}/>
                    </FormItem>


                    <FormItem required label={<FormattedMessage id="js.com.Eme.0008" defaultMessage="联系人电话" />}>
                        <FormControlPhone disabled={btnFlag === 2}
                                          {...getFieldProps('contactPhone', {
                                              validateTrigger: 'onBlur',
                                              initialValue: contactPhone || '',
                                              rules: [{
                                                  type: 'string',
                                                  required: true,
                                                  pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                                  message: <FormattedMessage id="js.com.Eme.0009" defaultMessage="请输入联系人电话" />,
                                              }],
                                          })}
                        />
                        <FormError errorMsg={getFieldError('contactPhone')}/>
                    </FormItem>

                    <FormItem required label={<FormattedMessage id="js.com.Eme.0010" defaultMessage="与乘客关系" />}>
                        <FormControl disabled={btnFlag === 2}
                                     {...getFieldProps('contactRelation', {
                                         validateTrigger: 'onBlur',
                                         initialValue: contactRelation || '',
                                         rules: [{
                                             type: 'string',
                                             required: true,
                                             pattern: /\S+/ig,
                                             message: <FormattedMessage id="js.com.Eme.0011" defaultMessage="请输入与乘客关系" />,
                                         }],
                                     })}
                        />
                        <FormError errorMsg={getFieldError('contactRelation')}/>
                    </FormItem>

                    <FormItem label={<FormattedMessage id="js.com.Eme.0012" defaultMessage="备注" />}>
                        <FormControl disabled={btnFlag === 2}
                                     {...getFieldProps('remark', {
                                         initialValue: remark || '',
                                     })}
                        />
                        <FormError errorMsg={getFieldError('remark')}/>
                    </FormItem>
                </FormList>
            </PopDialog>
        )
    }
}

export default FormList.createForm()(injectIntl(AddEditEmergency));
