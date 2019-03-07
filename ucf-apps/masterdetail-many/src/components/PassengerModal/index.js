import React, {Component} from "react";
import {actions} from "mirrorx";
import { FormControl, Switch} from "tinper-bee";
import Select from 'bee-select';
import moment from "moment";
import DatePicker from "tinper-bee/lib/Datepicker";
import {RefIuapDept} from 'components/RefViews';
import InputNumber from "bee-input-number";
import PopDialog from 'components/Pop';
import FormControlPhone from 'components/FormControlPhone';
import FormError from 'components/FormError';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import FormList from 'components/FormList'
import './index.less'

const FormItem = FormList.Item;
const {Option} = Select;
const format = "YYYY-MM-DD";
let titleArr = ["新增", "修改", "详情"];

class AddEditPassenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            btnFlag: 0,
            isVip: false
        }
    }

    async componentWillReceiveProps(nextProps) {
        const {btnFlag, currentIndex} = this.props;
        const {btnFlag: nextBtnFlag, currentIndex: nextCurrentIndex, passengerObj, checkTable, modalVisible} = nextProps;
        if (btnFlag !== nextBtnFlag || currentIndex !== nextCurrentIndex) { // 弹框默认值的条件
            // 防止网络阻塞造成btnFlag显示不正常
            this.setState({btnFlag: nextBtnFlag});
            let rowData = {};
            let isVip = false;
            try {
                // 判断是否重后端请求数据
                if (nextBtnFlag > 0 && checkTable === "passenger" && modalVisible) {
                    this.props.form.resetFields();
                    const {list} = passengerObj;
                    rowData = list[nextCurrentIndex] || {};
                    if (rowData.isVip) isVip = rowData.isVip;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setState({rowData, isVip});
            }
        }
    }


    /**
     * button关闭Modal 同时清空state
     * @param {Boolean} isSave 判断是否添加或者更新
     */
    onCloseEdit = (isSave) => {
        // 关闭当前 弹框清空当前的state的值，防止下次进入是上一次的数据
        this.setState({rowData: {}, btnFlag: 0});
        this.props.form.resetFields();
        this.props.onCloseModal(isSave);
    }


    /**
     *  提交信息
     */
    onSubmitEdit = () => {
        const _this = this;
        const {btnFlag}=_this.state;
        this.props.form.validateFields(async (err, values) => {ls
            if (!err) {
                let {rowData} = _this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                // 参照处理
                const {dept} = values;
                if (dept) {
                    const {refpk} = JSON.parse(dept);
                    values.dept = refpk;

                }
                // 是否会员，从state中取值
                const {isVip} = this.state; //不能使用form
                values.isVip = isVip;

                if(!isVip){ // 如果不是会员
                    values.grade = 0;
                    values.expirationDate = "";
                }

                try {
                    values.expirationDate = values.expirationDate.format(format);
                } catch (e) {
                }
                values.btnFlag=btnFlag;
                _this.onCloseEdit(true); // 关闭弹框 无论成功失败
                actions.masterDetailMany.savePassenger(values); //保存主表数据

            }
        });
    }

    /**
     *
     * @description 底部按钮是否显示处理函数
     * @param {number} btnFlag 为页面标识
     * @returns footer中的底部按钮
     */
    onHandleBtns = (btnFlag) => {
        let _this = this;
        let btns = [

            {
                label: '取消',
                fun: this.onCloseEdit,
                shape: 'border'
            },
            {
                label: '确定',
                fun: _this.onSubmitEdit,
                colors: 'primary'
            },
        ];

        if (btnFlag == 2) {
            btns = [];
        }
        return btns;
    }


    render() {
        let _this = this;
        const {form, modalVisible} = _this.props;

        const {getFieldProps, getFieldError,} = form;
        const {rowData, btnFlag, isVip} = _this.state;

        const {code, phone, sex, grade, name, dept, deptName, expirationDate} = rowData;

        let btns = _this.onHandleBtns(btnFlag),
            isDisabled = btnFlag > 1 ? true : false;
        return (
            <PopDialog
                ref={node => this.dialogNode = node}
                show={modalVisible}
                size='lg'
                close={this.onCloseEdit}
                title={titleArr[btnFlag]}
                btns={btns}
                className='passenger-modal'
            >
                <FormList>
                    <FormItem label="乘客编号">
                        <FormControl disabled
                                     {...getFieldProps('code', {
                                         initialValue: code || '',
                                     })}
                        />
                    </FormItem>

                    <FormItem required label="乘客姓名">
                        <FormControl disabled={isDisabled}
                                     {...getFieldProps('name', {
                                         validateTrigger: 'onBlur',
                                         initialValue: name || '',
                                         rules: [{
                                             required: true, message: '请输入乘客姓名'

                                         }],
                                     })}
                        />
                        <FormError errorMsg={getFieldError('name')}/>
                    </FormItem>

                    <FormItem required label="部门">
                        <RefIuapDept
                            disabled={btnFlag === 2}
                            {...getFieldProps('dept', {
                                validateTrigger: 'onChange',
                                initialValue: JSON.stringify({
                                    refpk: dept || "",
                                    refname: deptName || "",
                                }),
                                rules: [{
                                    message: '请选择部门',
                                    pattern: /[^({"refname":"","refpk":""}|{"refpk":"","refname":""})]/,
                                }],
                            })}
                        />
                        {/*<InputNumber iconStyle="one" min={0} step={1} disabled={btnFlag === 2} max={99}/>*/}

                        <FormError errorMsg={getFieldError('dept')}/>
                    </FormItem>

                    <FormItem required label="乘客性别">
                        <Select disabled={isDisabled}
                                {...getFieldProps('sex', {
                                    initialValue: sex || 1,
                                    rules: [{
                                        required: true, message: '请选择乘客性别',
                                    }],
                                })}
                        >
                            <Option value={1}>女</Option>
                            <Option value={2}>男</Option>
                        </Select>
                        <FormError errorMsg={getFieldError('sex')}/>
                    </FormItem>

                    <FormItem required label={"手机号"}>
                        <FormControlPhone disabled={isDisabled}
                                          {...getFieldProps('phone', {
                                              validateTrigger: 'onBlur',
                                              initialValue: phone || '',
                                              rules: [{
                                                  required: true,
                                                  pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                                  message: '请正确输入手机号',

                                              }],
                                          })}
                        />
                        <FormError errorMsg={getFieldError('phone')}/>
                    </FormItem>

                    <FormItem label={"是否会员"}>
                        <Switch
                            disabled={isDisabled}
                            checked={isVip}
                            checkedChildren={"是"}
                            unCheckedChildren={"否"}
                            onChange={(value) => {
                                _this.setState({isVip: value});
                            }}
                        />
                    </FormItem>

                    {isVip ? (
                        <FormItem required label={"会员等级"}>
                            <Select disabled={isDisabled}
                                    {...getFieldProps('grade', {
                                        initialValue: grade || 1,
                                        rules: [{
                                            required: true, message: '请选择会员等级',
                                        }],
                                    })}
                            >
                                <Option value={1}>初级会员</Option>
                                <Option value={2}>中级会员</Option>
                                <Option value={3}>高级会员</Option>
                            </Select>
                        </FormItem>
                    ) : null}

                    {isVip ? (
                        <FormItem required label={"到期日期"}>
                            <DatePicker className='form-item' format={format} disabled={isDisabled}
                                        locale={zhCN}
                                        getCalendarContainer={() => {
                                            return document.querySelector('.passenger-modal')
                                        }}
                                        {...getFieldProps('expirationDate', {
                                            initialValue: expirationDate ? moment(expirationDate) : moment(),
                                            validateTrigger: 'onBlur',
                                            rules: [{
                                                required: true, message: '请选择会员到期日期'
                                            }],
                                        })}
                            />
                            <FormError errorMsg={getFieldError('expirationDate')}/>
                        </FormItem>
                    ) : null}
                </FormList>
            </PopDialog>
        )
    }
}

export default FormList.createForm()(AddEditPassenger);
