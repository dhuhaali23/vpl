/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import 'reactflow/dist/style.css';
import { ExpSB6 } from './sidebar6';
import '../../style/workspaceStyle.css';
import Ammeter from './Elements/Ammeter';
import { GrNotes } from 'react-icons/gr';
import ACSource from './Elements/ACSource';
import Voltmeter from './Elements/Voltmeter';
import Capacitor from './Elements/Capacitor';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GlobalStore } from '../../store/index';
import SingeSwitch from './Elements/SingeSwitch';
import { AvatarLogo } from '../layout/AvatarLogo';
import { WarningOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, InputNumber, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import CustomConnectionLine from '../CommonElements/CustomConnectionLine';
import { BsFillPlayFill, BsStopFill, BsFillTrashFill } from 'react-icons/bs';
import {
    addEdge,
    Controls,
    ReactFlow,
    updateEdge,
    ControlButton,
    useEdgesState,
    useNodesState,
    ReactFlowProvider,
} from 'reactflow';
import { Instructions6 } from './instructions6';

const nodeTypes = {
    Ammeter,
    ACSource,
    Voltmeter,
    Capacitor,
    SingeSwitch,
};

let counter = 0;
let phase = 0;

let IntervalID;

function startInterval({ Func, time }) {
    IntervalID = setInterval(Func, time);
}

function stopInterval() {
    clearInterval(IntervalID);
}

const Workspace6 = (props) => {

    const navigate = useNavigate();

    const reactFlowWrapper = useRef(null);

    const edgeUpdateSuccessful = useRef(true);

    const [messageApi, contextHolder] = message.useMessage();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [ShowInstructions, setShowInstructions] = useState(false);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [SelectedItem, setSelectedItem] = useState({
        nodes: [],
        edges: []
    });

    const {
        setAmmeter,
        setACSource,
        setCapacitor,
        setVoltmeter,
        setTheCurrent,
        setSingeSwitch,
        setSwitchStatus,
        setRun, Run,
        voltage, setVoltage,
        setRunError, RunError,
        capacity, setCapacity,
        frequency, setFrequency,
        setCapGroup, setCapImgIdx,
        setTheInsulator, theInsulator
    } = GlobalStore();

    const connectionLineStyle = {
        stroke: 'black',
        strokeWidth: 1.5,
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

    const getId = (type) => {
        if (type == 'SingeSwitch') {
            setSingeSwitch(true)
            return `switchId1`
        } else if (type == 'Voltmeter') {
            setVoltmeter(true)
            return `VoltmeterId1`
        } else if (type == 'Capacitor') {
            setCapacitor(true)
            return `CapacitorId1`
        } else if (type == 'ACSource') {
            setACSource(true)
            return `ACSourceId1`
        } else if (type == 'Ammeter') {
            setAmmeter(true)
            return `AmmeterId1`
        }
    }

    const checkConnections = (edges) => {
        const correctConnections = [
            "acS_swT",
            "swS_vT",
            "swS_aT",
            "aS_cT",
            "cS_acT",
            "vS_acT",
        ]
        let incorrectLinksCounter = 0;
        let checkedEdges = edges.filter((edge) => {
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

    const onConnect = useCallback((params) => {
        params.id = params.sourceHandle + "_" + params.targetHandle;
        params.type = 'smoothstep'
        params.style = {
            strokeWidth: 1.5,
            stroke: 'rgba(0,0,0,1)',
        }
        setEdges((eds) => addEdge(params, eds))
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDeleteNode = useCallback((e) => {
        StopFunc()
        if (e[0].type == 'SingeSwitch') {
            setSingeSwitch(false)
            return
        } else if (e[0].type == 'Capacitor') {
            setCapacitor(false)
            return
        } else if (e[0].type == 'ACSource') {
            setACSource(false)
            return
        } else if (e[0].type == 'Ammeter') {
            setAmmeter(false)
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

    const RunFunc = useCallback(() => {
        if (nodes.length == 5) {
            if (edges.length == 6) {
                let status = checkConnections(edges) > 0 ? false : true;
                if (status == true) {
                    if (voltage > 0) {
                        setRun(true)
                        Message({
                            content: 'الدائرة جاهزة لتنفيذ التجربة',
                            type: 'success'
                        })
                    } else {
                        Message({
                            content: 'فرق جهد المصدر (0V)',
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
    }, [edges, nodes])

    const StopFunc = () => {
        setRun(false)
        setSwitchStatus(false)
        stopAnimation()
        stopInterval();
    }

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

    const equationFunc = ({ C, V, F, K }) => {
        let volt = V ? V : voltage;
        let freq = F ? F : frequency;
        let Cap = C ? C : capacity;
        let kValue = K ? K : theInsulator ? 2 : 1
        let Xc = 1 / (2 * Math.PI * freq * (Cap * kValue));
        let I = volt / Xc;
        return {
            theVoltage: volt,
            theFrequency: freq,
            theCurrent: I,
            theResistance: Xc,
            theCapacity: Cap
        }
    }

    const capacitorAnimation = () => {

        if (phase === 2) {
            setCapGroup(1)
        }
        if (phase === 4) {
            phase = phase - 4;
            setCapGroup(0)
        }
        if (counter < 10) {
            startInterval({
                Func: () => {

                    if (counter < 10) {
                        setCapImgIdx(counter)
                        counter = counter + 1;
                    } else {
                        phase = phase + 1;
                        stopInterval();
                        capacitorAnimation();
                    }
                },
                time: 300
            })
        }
        if (counter == 10) {
            startInterval({
                Func: () => {

                    if (counter > 0) {
                        setCapImgIdx(counter)
                        counter = counter - 1;
                    } else {
                        phase = phase + 1;
                        stopInterval();
                        capacitorAnimation();
                    }
                },
                time: 300
            })
        }
    }

    const startRunning = (C, V, F, K) => {
        let res = equationFunc({
            C: C ? C : null,
            V: V ? V : null,
            F: F ? F : null,
            K: K ? K : null,
        })
        stopAnimation();
        if (Run) {
            startAnimation();
            setTheCurrent(res.theCurrent);
            capacitorAnimation();
        } else {
            stopRunning();
        }

    }

    const stopRunning = () => {
        setSwitchStatus(false)
        stopAnimation();
        stopInterval();
    }

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'switchId1') {

                    node.data = {
                        ...node.data,
                        stopRunning,
                        startRunning,
                    }
                }
                if (node.id === 'VoltmeterId1') {
                    node.data = {
                        ...node.data,
                    }
                }
                if (node.id === 'AmmeterId1') {

                    node.data = {
                        ...node.data,
                    }
                }
                if (node.id === 'ACSourceId1') {

                    node.data = {
                        ...node.data
                    }
                }
                if (node.id === 'CapacitorId1') {

                    node.data = {
                        ...node.data,
                    }
                }

                return node;
            })
        );
    }, [setNodes, Run, startRunning, stopRunning]);

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
            <Instructions6 ShowInstructions={ShowInstructions} setShowInstructions={setShowInstructions} />
            <ReactFlowProvider>
                <div className='flex flex-col justify-start  items-center' >
                    <aside style={{ width: '100px', backgroundColor: "#F1F1F2", borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '2px' }} className='absolute top-32 bottom-32 right-4 shadow-xl z-10 flex flex-col items-center overflow-x-hidden overflow-y-auto rounded-lg' >
                        <ExpSB6 />
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
                                        search: `?${createSearchParams({ exp: 5 })}`
                                    })}
                                    style={{ color: 'white', borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '1px', background: 'orange' }}
                                >
                                    إختبر نفسك !
                                </Button>
                            </div>
                        </div>
                    </aside>
                    {
                        SelectedItem.nodes.length > 0 && (SelectedItem.nodes[0].id == 'ACSourceId1' || SelectedItem.nodes[0].id == 'CapacitorId1') ? (
                            <div
                                className='shadow animate__animated animate__fadeIn'
                                style={{
                                    zIndex: 100,
                                    bottom: '15px',
                                    direction: 'rtl',
                                    borderRadius: '8px',
                                    position: 'absolute',
                                    borderWidth: '2px',
                                    background: '#F1F1F2',
                                    borderColor: 'rgba(57, 138, 185,0.8)',
                                }}
                            >
                                {
                                    SelectedItem.nodes[0].id == 'CapacitorId1' ? (
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
                                                <InputNumber
                                                    disabled={Run}
                                                    size='small'
                                                    addonBefore={'السعة'}
                                                    addonAfter={'F'}
                                                    style={{
                                                        width: '100%',
                                                        marginBottom: '10px'
                                                    }}
                                                    min={0.05}
                                                    max={0.20}
                                                    step={0.01}
                                                    defaultValue={0.05}
                                                    value={capacity}
                                                    onChange={(e) => {
                                                        if (e) {
                                                            setCapacity(e)
                                                        } else {
                                                            setCapacity(0.05)
                                                        }
                                                    }}

                                                />
                                                <Checkbox
                                                    style={{
                                                        // width: '100%'
                                                    }}
                                                    defaultChecked={theInsulator}
                                                    checked={theInsulator}
                                                    onChange={(e) => {
                                                        setTheInsulator(e.target.checked);
                                                        if (Run) {
                                                            if (e.target.checked == true) {
                                                                if (Run) {
                                                                    setTheCurrent(
                                                                        equationFunc({
                                                                            K: 2
                                                                        }).theCurrent
                                                                    );
                                                                }
                                                            } else {
                                                                if (Run) {
                                                                    setTheCurrent(
                                                                        equationFunc({
                                                                            K: 1
                                                                        }).theCurrent
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    عازل
                                                </Checkbox>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <Divider style={{ margin: '5px 0px', fontWeight: 'bold' }} orientation='left' >المذبذب الكهربائي</Divider>
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
                                                    addonBefore={'التردد'}
                                                    addonAfter={'Hz'}
                                                    style={{
                                                        marginBottom: '10px',
                                                        width: '100%'
                                                    }}
                                                    min={0.10}
                                                    max={2.00}
                                                    step={0.01}
                                                    defaultValue={0.10}
                                                    value={frequency}
                                                    onChange={(e) => {
                                                        if (e) {
                                                            setFrequency(e)
                                                        } else {
                                                            setFrequency(0.10)
                                                        }
                                                    }}
                                                />
                                                <InputNumber
                                                    disabled={Run}
                                                    size='small'
                                                    addonBefore={'فرق الجهد'}
                                                    addonAfter={'V'}
                                                    style={{ width: '100%' }}
                                                    min={0}
                                                    max={50}
                                                    step={1}
                                                    defaultValue={0}
                                                    value={voltage}
                                                    onChange={(e) => {
                                                        if (e) {
                                                            setVoltage(e)
                                                        } else {
                                                            setVoltage(0)
                                                        }
                                                    }}
                                                />
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
                            nodeTypes={nodeTypes}
                            onConnect={onConnect}
                            onDragOver={onDragOver}
                            onEdgeUpdate={onEdgeUpdate}
                            onNodesDelete={onDeleteNode}
                            onEdgesDelete={onDeleteEdge}
                            onInit={setReactFlowInstance}
                            onEdgesChange={onEdgesChange}
                            onNodesChange={onNodesChange}
                            style={{ background: '#BFD7ED' }}
                            onEdgeUpdateEnd={onEdgeUpdateEnd}
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
                                            }
                                            }
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

export default Workspace6;