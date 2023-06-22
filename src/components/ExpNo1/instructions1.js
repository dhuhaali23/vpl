import React from 'react';
import { Modal, Typography } from "antd"

export const Instructions1 = ({ ShowInstructions, setShowInstructions }) => {
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
                    >
                        <ul style={{ listStyleType: 'disc' }} >
                            <li>
                                <Typography.Title level={5} style={{ margin: 0 }} >
                                    ادوات التجربة
                                </Typography.Title>
                            </li>
                            <Typography.Paragraph style={{ textAlign: 'justify' }} >
                                بطارية فولطيتها مناسبة، مفتاح كهربائي، فولطميتر، متسعة ذات الصفيحتين المتوازيتين.
                            </Typography.Paragraph>
                            <li className='font-bold' >
                                <Typography.Title level={5} style={{ margin: 0 }} >
                                    خطوات التجربة
                                </Typography.Title>
                            </li>
                            <Typography.Paragraph>
                                <ol>
                                    <li>
                                        <Typography.Title level={5} style={{ margin: 0 }} >
                                            شحن المتسعة
                                        </Typography.Title>
                                    </li>
                                    <Typography.Paragraph style={{ textAlign: 'justify' }} className="px-6" >
                                        نربط احد قطبي البطارية بإحدى صفيحتي المتسعة, و نربط القطب الاخر باحد طرفي المفتاح ثم نربط الطرف الاخر للمفتاح بالصفيحة الثانية للمتسعة و بعدها نقوم بتشغيل الدائرة من خلال الضغط على زر التشغيل الموجود في الزاوية العليا من الجهة اليسرى للواجهة ثم نقوم بغلق المفتاح و عندها تبدأ عملية الشحن.
                                    </Typography.Paragraph>
                                    <li>
                                        <Typography.Title level={5} style={{ margin: 0 }} >
                                            تأثير العازل
                                        </Typography.Title>
                                    </li>
                                    <Typography.Paragraph style={{ textAlign: 'justify' }} className="px-6" >
                                        بعد ان يتم شحن المتسعة ننتقل للخطوة الثانية و التي هي خطوة "تأثير العازل" و يتم ذلك من خلال الضغط على الزر الذي يحمل الرقم (2) والموجود في اعلى منتصف الواجهة و في هذه الخطوة نقوم بربط جهاز الفولطميتر بالمتسعة و نشغل الدائرة فنلاحظ قراءة الفولطميتر و التي تمثل مقدار فرق الجهد بين صفيحتي المتسعة, ثم نقوم بادخال لوح من مادة عازلة بين صفيحتي المتسعة و ذلك من خلال الضغط على المتسعة فيضهر مربع صغير في اسفل منتصف الواجهة يحتوي على اختيار اضافة العازل و بمجرد اضافة العازل نلاحظ تغيير قراءة الفولطميتر.
                                    </Typography.Paragraph>
                                </ol>
                            </Typography.Paragraph>
                        </ul>
                    </Modal>
                ) : null
            }
        </>
    )
}