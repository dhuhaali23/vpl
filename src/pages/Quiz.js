

import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Questions from '../components/CommonElements/Question.json';
import { Button, Card, Form, Modal, Radio, Space, Typography } from "antd";

const Quiz = () => {
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const confirm = (saveAnswersFunc, unAnsweredQuestions) => {
        modal.confirm({
            style: { userSelect: 'none' },
            direction: 'rtl',
            title: 'تنبيه',
            icon: <ExclamationCircleOutlined />,
            content:
                <>
                    {
                        unAnsweredQuestions === 0 ?
                            <div className='font-semibold' >عند تأكيد هذا الاجراء سيتم انهاء الاختبار و الانتقال الى صفحة النتيجة</div> :
                            unAnsweredQuestions === 1 ?
                                <div className='font-semibold' >لديك سؤال لم تقم بالاجابة عليه و عند تأكيد هذا الاجراء سيتم إنهاء الاختبار و الانتقال الى صفحة النتيجة</div> :
                                unAnsweredQuestions === 2 ?
                                    <div className='font-semibold' >لديك سؤالين لم تقم بالاجابة عليهما و عند تأكيد هذا الاجراء سيتم إنهاء الاختبار و الانتقال الى صفحة النتيجة</div> :
                                    <div className='font-semibold' >لديك ({unAnsweredQuestions}) اسئلة لم تقم بالاجابة عليها و عند تأكيد هذا الاجراء سيتم إنهاء الاختبار و الانتقال الى صفحة النتيجة</div>
                    }
                </>,
            okText: 'تأكيد',
            cancelText: 'إلغاء',
            okButtonProps: { type: 'primary', danger: true },
            onOk: () => {
                saveAnswersFunc();
                navigate("/result");
            },
        });
    };

    const handleFinish = async (choices) => {
        let unAnsweredQ = 0;
        let resultArray = [];
        Questions[searchParams.get('exp')].forEach((item, i) => {
            if (choices[`answer${i + 1}`] !== undefined) {
                item.userAnswerIdx = choices[`answer${i + 1}`];
                if (item.correctAnswerIdx === item.userAnswerIdx) {
                    item.status = true;
                } else {
                    item.status = false;
                }
            } else {
                unAnsweredQ = unAnsweredQ + 1;
                item.userAnswerIdx = null;
                item.status = null;
            }
            resultArray.push(item);
        })
        confirm(() => sessionStorage.setItem('answers', JSON.stringify(resultArray)), unAnsweredQ)
    };

    return (
        <>
            {contextHolder}
            <Form
                name="testPage"
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className='select-none'

            >
                <div>
                    {
                        Questions[searchParams.get('exp')].map((item, i) => {
                            return (
                                <section
                                    className='animate__animated animate__slideInUp'
                                    key={i + 1}
                                    style={{ background: '#398AB9', paddingTop: 6, paddingRight: 6, borderRadius: 12, marginTop: 20 }}>
                                    <Card style={{ width: '80vw', background: "#F1F1F2" }} bordered={false} title={`السؤال ${i + 1}`}>
                                        <Space direction="vertical">
                                            <Typography.Paragraph strong style={{ fontSize: 17 }} >
                                                {
                                                    item.question
                                                }
                                                ؟
                                            </Typography.Paragraph>
                                        </Space>
                                        <Form.Item
                                            name={`answer${i + 1}`}
                                        >
                                            <Radio.Group>
                                                <Space direction="vertical" >
                                                    {
                                                        item.answers.map((answer, j) => (
                                                            <Radio
                                                                key={j + 1}
                                                                value={j}
                                                                style={{ fontSize: 17 }}
                                                            >
                                                                {answer}
                                                            </Radio>
                                                        ))
                                                    }
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Card>
                                </section>
                            )
                        })
                    }
                </div>
                <div className=' absolute left-0 right-0 bottom-10 ' >
                    <Button
                        size='large'
                        type='primary'
                        shape='circle'
                        htmlType='submit'
                        className='animate__animated animate__slideInLeft'
                        style={{
                            position: 'sticky',
                            backgroundColor: 'orange',
                            color: 'black',
                            bottom: 0,
                            right: '95vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        icon={<AiOutlineCheckCircle size={30} />}
                    />
                </div>
            </Form >
        </>
    )
}

export default Quiz;