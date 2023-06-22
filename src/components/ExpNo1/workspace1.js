/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import 'reactflow/dist/style.css';
import '../../style/workspaceStyle.css';
import { GrNotes } from 'react-icons/gr'
import { BsFillPlayFill, BsStopFill, BsFillTrashFill } from 'react-icons/bs'
import {
    Controls,
    ReactFlow,
    useEdgesState,
    useNodesState,
    ReactFlowProvider,
    addEdge,
    updateEdge,
    ControlButton,
} from 'reactflow';
import { ExpSB1 } from './sidebar1';
import { GlobalStore } from '../../store/index';
import { Button, Checkbox, Divider, InputNumber, message, Popconfirm, Steps } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import Capacitor from './Elements/capacitor';
import DCSource from './Elements/DCSource';
import SingeSwitch from './Elements/SingleSwitch';
import Voltmeter from './Elements/Voltmeter';
import { AvatarLogo } from '../layout/AvatarLogo';
import { useNavigate, createSearchParams } from 'react-router-dom';
import CustomConnectionLine from '../CommonElements/CustomConnectionLine';
import { Instructions1 } from './instructions1';

const nodeTypes = {
    SingeSwitch,
    DCSource,
    Capacitor,
    Voltmeter,
};

let intervalID;
function startInterval({ Func, time }) {
    intervalID = setInterval(Func, time);
}

function stopInterval() {
    clearInterval(intervalID);
}

const Workspace1 = (props) => {

    const navigate = useNavigate();
    const reactFlowWrapper = useRef(null);
    const edgeUpdateSuccessful = useRef(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [ShowInstructions, setShowInstructions] = useState(false);
    const [checkCct, setCheckCct] = useState(0);
    const [SelectedItem, setSelectedItem] = useState({
        nodes: [],
        edges: []
    });
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
        setSingeSwitch,
        setDCSource,
        setCapacitor,
        setVoltmeter,
        setRun, Run,
        setSwitchStatus,
        setVoltmeterValue,
        setCapImgIdx, capImgIdx,
        setTheVoltage, theVoltage,
        setRunError, RunError,
        setCurrentStep, currentStep,
        setTheInsulator, theInsulator,
    } = GlobalStore();
    const connectionLineStyle = {
        strokeWidth: 1.5,
        stroke: 'black',
        type: 'smoothstep',
    };
    const Message = ({ type, content }) => {
        messageApi.open({
            type: type,
            content: content,
            style: {
                marginTop: '65px',
                direction: 'rtl'
            },
        });
    };

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, [setEdges]);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const getId = (type) => {
        if (type == 'SingeSwitch') {
            setSingeSwitch(true)
            return `switchId1`
        } else if (type == 'DCSource') {
            setDCSource(true)
            return `sourceId1`
        } else if (type == 'Capacitor') {
            setCapacitor(true)
            return `capacitorId1`
        } else if (type == 'Voltmeter') {
            setVoltmeter(true)
            return `voltmeterId1`
        }
    }

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('data');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(type),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        }, [reactFlowInstance]);

    const onDeleteNode = useCallback((e) => {
        StopFunc()
        if (e[0].type == 'SingeSwitch') {
            setSingeSwitch(false)
            return
        } else if (e[0].type == 'DCSource') {
            setDCSource(false)
            return
        } else if (e[0].type == 'Capacitor') {
            setCapacitor(false)
            return
        } else if (e[0].type == 'Voltmeter') {
            setVoltmeter(false)
            return
        }
        return
    }, []);

    const onDeleteEdge = useCallback(() => {
        StopFunc()
        return
    }, [])

    const onConnect = useCallback((params) => {
        params.id = params.sourceHandle + "_" + params.targetHandle;
        params.type = 'smoothstep'
        params.style = {
            strokeWidth: 1.5,
            stroke: 'rgba(0,0,0,1)',
        }
        if (params.id === "dcS_cT") {
            setCheckCct(0);
        }
        if (params.id === "dcS_swT") {
            setCheckCct(1);
        }
        setEdges((eds) => addEdge(params, eds))
    }, []);

    const startAnimation = useCallback(() => {
        let animatedEdges = edges.map((edge) => {
            edge.type = 'smoothstep'
            edge.animated = true
            edge.style = {
                strokeWidth: 1.5,
                stroke: '#FF0072',
            }
            return edge
        })
        setEdges(animatedEdges)
    }, [edges, nodes])

    const stopAnimation = useCallback(() => {
        let animatedEdges = edges.map((edge) => {

            edge.type = 'smoothstep'
            edge.animated = false
            edge.style = {
                strokeWidth: 1.5,
                stroke: 'rgba(0,0,0,1)',
            }
            return edge
        })
        setEdges(animatedEdges)
    }, [edges, nodes])

    const startCct1Running = (Q) => {
        stopCct1Running();
        if (Q < 10) {
            let counter = Q;
            startAnimation();
            startInterval({
                Func: () => {
                    counter = counter + 1;
                    if (counter == 11) {
                        stopCct1Running();
                    } else {
                        setCapImgIdx(counter)
                    }
                },
                time: 1000
            })
        }
    }

    const stopCct1Running = () => {
        stopAnimation();
        stopInterval();
    }

    const startCct2Running = (K) => {
        if (capImgIdx == 0) {
            setVoltmeterValue(0.01)
            Message({
                content: 'المتسعة غير مشحونة',
                type: 'warning'
            })
        } else {
            stopCct2Running();
            startAnimation();
            let capacitorVoltage = (theVoltage / 10) * capImgIdx;
            setVoltmeterValue(capacitorVoltage / K)
        }
    }

    const stopCct2Running = () => {
        stopAnimation();
        setVoltmeterValue(0.01)
    }

    const onStepChange = (value) => {
        if (value === 0) {
            setNodes([]);
            setEdges([]);
            setRun(false);
            setRunError(false);
            setDCSource(false);
            setCapacitor(false);
            setVoltmeter(false);
            setSingeSwitch(false);
            setSwitchStatus(false);
            setTheInsulator(false)
            setTheVoltage(0);
            setCapImgIdx(0);
            setVoltmeterValue(0.01)
            setCurrentStep(value);
        } else {
            stopCct1Running();
            setNodes((n) => n.filter((e) => e.id === 'capacitorId1'));
            setEdges([]);
            setRun(false);
            setRunError(false);
            setCurrentStep(value);
        }
    };

    const checkFStepCct = (edges) => {

        const correctConnections = [
            [
                "dcS_cT",
                "swS_dcT",
                "cS_swT"
            ],
            [
                "dcS_swT",
                "cS_dcT",
                "swS_cT"
            ]
        ]
        let incorrectLinksCounter = 0;
        let checkedEdges = edges.map((edge) => {
            if (!correctConnections[checkCct].includes(edge.id)) {
                edge.style = {
                    strokeWidth: 1.5,
                    stroke: '#FF0072',
                }
                incorrectLinksCounter = incorrectLinksCounter + 1;
            }
            return edge
        })
        setEdges(checkedEdges)
        return incorrectLinksCounter;
    }

    const checkSStepCct = (edges) => {
        const correctConnections = [
            "cS_vT",
            "vS_cT"
        ];
        let incorrectLinksCounter = 0;
        let checkedEdges = edges.map((edge) => {
            if (!correctConnections.includes(edge.id)) {
                edge.style = {
                    strokeWidth: 1.5,
                    stroke: '#FF0072',
                }
                incorrectLinksCounter = incorrectLinksCounter + 1;
            }
            return edge
        })
        setEdges(checkedEdges)
        return incorrectLinksCounter;
    }

    const RunFunc = useCallback(() => {
        if (currentStep === 0) {
            if (nodes.length === 3) {
                if (edges.length === 3) {
                    let status = checkFStepCct(edges) > 0 ? false : true;
                    if (status == true) {
                        if (theVoltage > 0) {
                            setRun(true)
                            Message({
                                content: 'الدائرة جاهزة لتنفيذ التجربة',
                                type: 'success'
                            })
                        } else {
                            Message({
                                content: 'فرق جهد البطارية (0V), لا يمكن اجراء عملية الشحن',
                                type: 'error'
                            })
                            setRun(false)
                        }
                    } else {
                        Message({
                            content: 'يجب ربط الدائرة بصورة صحيحة',
                            type: 'error'
                        })
                        setRun(false)
                    }
                } else {
                    Message({
                        content: 'يجب اكمال ربط الدائرة',
                        type: 'error'
                    })
                    setRun(false)
                }
            } else {
                Message({
                    content: 'يجب استخدام جميع عناصر التجربة',
                    type: 'error'
                })
                setRun(false)
            }
        } else {
            if (nodes.length === 2) {
                if (edges.length === 2) {
                    let status = checkSStepCct(edges) > 0 ? false : true;
                    if (status == true) {
                        setRun(true)
                        if (theInsulator == true) {
                            startCct2Running(2)
                        } else {
                            startCct2Running(1)
                        }
                    } else {
                        Message({
                            content: 'يجب ربط الدائرة بصورة صحيحة',
                            type: 'error'
                        })
                        setRun(false)
                    }
                } else {
                    Message({
                        content: 'يجب اكمال ربط الدائرة',
                        type: 'error'
                    })
                    setRun(false)
                }
            } else {
                Message({
                    content: 'يجب استخدام جميع عناصر التجربة',
                    type: 'error'
                })
                setRun(false)
            }
        }
    }, [edges, nodes])

    const StopFunc = () => {
        stopAnimation();
        setRun(false);
        if (currentStep === 0) {
            setSwitchStatus(false);
            stopInterval();
        } else {
            stopCct2Running();
        }
    }

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'capacitorId1') {
                    node.data = { ...node.data }
                }
                if (node.id === 'switchId1') {

                    node.data = { ...node.data, startCct1Running, stopCct1Running }
                }
                if (node.id === 'voltmeterId1') {

                    node.data = { ...node.data }
                }
                return node;
            })
        );
    }, [setNodes, Run, SelectedItem]);

    useEffect(() => {
        let anchorsArr = document.getElementsByTagName('a');
        if (anchorsArr.length > 0) {
            for (let idx = 0; idx < anchorsArr.length; idx++) {
                if (anchorsArr[idx].href === "https://reactflow.dev/") {
                    anchorsArr[idx].style.display = 'none';
                }
            }
        }
    }, []);

    return (
        <div className='select-none'>
            {contextHolder}
            <Instructions1 ShowInstructions={ShowInstructions} setShowInstructions={setShowInstructions} />
            <ReactFlowProvider>
                <div className='flex flex-col justify-start  items-center' >
                    <aside style={{ width: '100px', backgroundColor: "#F1F1F2", borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '2px' }} className='absolute top-32 bottom-32 right-4 shadow-xl z-10 flex flex-col items-center overflow-x-hidden overflow-y-auto rounded-lg' >
                        <ExpSB1 />
                    </aside>
                    <aside
                        dir='rtl'
                        style={{ height: '64px', paddingRight: '10px', paddingLeft: '10px', background: '#F1F1F2' }} className='absolute w-full shadow m-0 z-10  ' >
                        <div className='flex justify-between items-center h-full '>
                            <AvatarLogo />
                            <div className='font-bold text-lg' >
                                {props.title}
                            </div>
                            <div className='flex justify-between items-center' >
                                <Popconfirm
                                    title="يجب تشغيل الدائرة اولاً"
                                    okButtonProps={{ style: { display: 'none' } }}
                                    cancelButtonProps={{ style: { display: 'none' } }}
                                    open={RunError}
                                    placement='bottomRight'
                                    showCancel={false}
                                    icon={<WarningOutlined />}
                                    overlayInnerStyle={{ paddingTop: 7, paddingBottom: 5 }}
                                >
                                    <Button
                                        className='shadow'
                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '1px', background: '#E3E3E3' }}
                                        icon={Run ? <BsStopFill color='red' size={'30px'} /> : <BsFillPlayFill size={'30px'} color='green' />}
                                        onClick={() => {
                                            if (RunError) {
                                                setRunError(false)
                                            }
                                            Run ?
                                                StopFunc()
                                                : RunFunc()
                                        }}
                                    />
                                </Popconfirm>
                                <Button
                                    className='font-semibold mr-2 shadow '
                                    onClick={() => navigate({
                                        pathname: '/quiz',
                                        search: `?${createSearchParams({ exp: 0 })}`
                                    })}
                                    style={{ color: 'black', borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '1px', background: 'orange' }}
                                >
                                    إختبر نفسك !
                                </Button>
                            </div>
                        </div>
                    </aside>
                    <div
                        className='shadow'
                        style={{
                            position: 'absolute',
                            top: '65px',
                            zIndex: 100,
                            background: '#F1F1F2',
                            padding: '10px 25px',
                            borderRadius: '0 0 8px 8px'
                        }}
                    >
                        <Steps
                            style={{
                                minWidth: '45vw'
                            }}
                            responsive={false}
                            current={currentStep}
                            onChange={onStepChange}
                            items={[
                                {
                                    title: 'شحن المتسعة',
                                },
                                {
                                    title: 'تأثير العازل',
                                },
                            ]}
                        />
                    </div>
                    {
                        SelectedItem.nodes.length > 0 && (SelectedItem.nodes[0].id == 'sourceId1' || SelectedItem.nodes[0].id == 'capacitorId1') ? (
                            <div
                                className='shadow animate__animated animate__fadeIn '
                                style={{
                                    zIndex: 100,
                                    background: '#F1F1F2',
                                    borderRadius: '8px',
                                    borderColor: 'rgba(57, 138, 185,0.8)',
                                    borderWidth: '2px',
                                    position: 'absolute',
                                    bottom: '15px',
                                    direction: 'rtl',
                                }}
                            >
                                {
                                    SelectedItem.nodes[0].id == 'sourceId1' ? (
                                        <>
                                            <div>
                                                <Divider style={{ margin: '5px 0px', fontWeight: 'bold' }} orientation='left' >البطارية</Divider>
                                            </div>
                                            <div
                                                className='flex flex-col justify-center items-center'
                                                style={{
                                                    minWidth: '20vw',
                                                    padding: '0px 10px 10px 10px'
                                                }}
                                            >
                                                <InputNumber
                                                    disabled={Run}
                                                    size='small'
                                                    addonBefore={'فرق الجهد'}
                                                    addonAfter={'V'}
                                                    min={0}
                                                    max={24}
                                                    defaultValue={5}
                                                    value={theVoltage}
                                                    step={0.1}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => {
                                                        if (e) {
                                                            setTheVoltage(e)
                                                        } else {
                                                            setTheVoltage(0)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <Divider style={{ margin: '5px 0px', fontWeight: 'bold' }} orientation='left' >المتسعة</Divider>
                                            </div>
                                            <div
                                                className='flex flex-col justify-center items-center'
                                                style={{
                                                    minWidth: '20vw',
                                                    padding: '0px 10px 10px 10px'
                                                }}
                                            >
                                                <Checkbox
                                                    style={{
                                                        // width: '100%'
                                                    }}
                                                    disabled={currentStep == 0}
                                                    defaultChecked={theInsulator}
                                                    checked={theInsulator}
                                                    onChange={(s) => {
                                                        setTheInsulator(s.target.checked)
                                                        if (Run) {
                                                            if (s.target.checked == true) {
                                                                startCct2Running(2)
                                                            } else {
                                                                startCct2Running(1)
                                                            }
                                                        }
                                                    }}
                                                >
                                                    اضافة عازل
                                                </Checkbox>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        ) : null
                    }
                    <div className=' w-screen h-screen m-0 p-0' ref={reactFlowWrapper} >
                        <ReactFlow
                            fitView
                            nodes={nodes}
                            edges={edges}
                            onDrop={onDrop}
                            className='bodyX'
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            onDragOver={onDragOver}
                            onEdgeUpdate={onEdgeUpdate}
                            onNodesDelete={onDeleteNode}
                            onEdgesDelete={onDeleteEdge}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onInit={setReactFlowInstance}
                            onEdgeUpdateEnd={onEdgeUpdateEnd}
                            style={{ background: '#BFD7ED' }}
                            onEdgeUpdateStart={onEdgeUpdateStart}
                            connectionLineStyle={connectionLineStyle}
                            onSelectionChange={(s) => setSelectedItem(s)}
                            connectionLineComponent={CustomConnectionLine}
                        >
                            <Controls style={{ display: 'flex', flexDirection: 'column-reverse', borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '2px', borderRadius: '4px' }} >
                                <ControlButton
                                    onClick={() => setShowInstructions(true)}
                                >
                                    <GrNotes />
                                </ControlButton>
                                {
                                    SelectedItem.edges.length > 0 || SelectedItem.nodes.length > 0 ? (
                                        <ControlButton
                                            onClick={() => {
                                                if (SelectedItem.nodes.length > 0) {
                                                    setNodes((nds) => nds.filter((n) => n.id !== SelectedItem.nodes[0].id));
                                                    onDeleteNode(SelectedItem.nodes)
                                                }
                                                if (SelectedItem.edges.length > 0) {
                                                    setEdges((eds) => eds.filter((e) => e.id !== SelectedItem.edges[0].id));
                                                    onDeleteEdge();
                                                }
                                            }}
                                        >
                                            <BsFillTrashFill />
                                        </ControlButton>
                                    ) : null
                                }
                            </Controls >
                        </ReactFlow>
                    </div>
                </div>
            </ReactFlowProvider>
        </div>
    )
}

export default Workspace1;