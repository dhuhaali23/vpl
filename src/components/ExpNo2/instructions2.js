import React from 'react';
import { Modal, Typography } from "antd"

export const Instructions2 = ({ ShowInstructions, setShowInstructions }) => {
    return (
        <>
            {
                ShowInstructions === true ? (
                    <Modal
                        className='select-none'
                        onCancel={() => setShowInstructions(false)}
                        cancelButtonProps={{ style: { display: 'none' } }}
                        okButtonProps={{ style: { display: 'none' } }}
                        title={<Typography.Title level={4} style={{ margin: 0 }} >تعليمات التجربة</Typography.Title>}
                        style={{ direction: 'rtl' }}
                        open={ShowInstructions}
                        width={'50vw'}
                    // bodyStyle={{background:'#F5F5DC'}}
                    >
                        <ul style={{ listStyleType: 'disc' }} >
                            <li>
                                <Typography.Title level={5} style={{ margin: 0 }} >
                                    ادوات التجربة
                                </Typography.Title>
                            </li>
                            <Typography.Paragraph style={{ textAlign: 'justify' }} >
                                بطارية فولطيتها مناسبة، مقاومة ثابتة، مصباحان متماثلان، كلفانوميتر، مفتاح مزدوج، متسعة ذات الصفيحتين المتوازيتين.
                            </Typography.Paragraph>
                            <li className='font-bold' >
                                <Typography.Title level={5} style={{ margin: 0 }} >
                                    خطوات التجربة
                                </Typography.Title>
                            </li>
                            <div className='pr-5' >
                                <Typography.Paragraph style={{ textAlign: 'justify' }} >
                                    <ol>
                                        <li>نربط الطرف السفلي المفتاح بالقطب السالب للبطارية، و نربط القطب الموجب للبطارية بالطرف الايمن للمقاومة.</li>
                                        <li>نربط الطرف الايسر للمقاومة باحد طرفي المصباح الاول, و نربط الطرف الاخر للمصباح بالطرف السالب للكلفانوميتر.</li>
                                        <li>نربط الطرف الموجب للكلفانوميتر بالطرف الايسر للمتسعة, و نربط الطرف الايمن للمتسعة بالطرف الوسطي للمفتاح.</li>
                                        <li>نربط الطرف العلوي للمفتاح بالمصباح الثاني و نربط الطرف الاخر للمصباح بالطرف السالب للكلفانوميتر.</li>
                                        <li>نشغل الدائرة من خلال الضغط على زر التشغيل الموجود في الزاوية العليا من الجهة اليسرى للواجهة.</li>
                                        <li>نجعل المفتاح في الموقع السفلي لشحن المتسعة و ذلك من خلال الضغط على المفتاح فنلاحظ توهج المصباح الاول و انحراف مؤشر الكلفانوميتر الى يمين صفر التدريجة و بداية عملية شحن المتسعة.</li>
                                        <li>بعد شحن المتسعة يمكن اجراء عملية التفريغ و ذلك من خلال الضغط على المفتاح لجعله على الموقع العلوي و عند ذلك نلاحظ توهج المصباح الثاني و انحراف مؤشر الكلفانوميتر الى يسار صفر التدريجة و بداية عملية التفريغ.</li>
                                    </ol>
                                </Typography.Paragraph>
                            </div>
                        </ul>
                    </Modal>
                ) : null
            }
        </>
    )
}