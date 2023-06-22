/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import 'reactflow/dist/style.css';
import Lamp from './Elements/lamp';
import { ExpSB2 } from './sidebar2';
import '../../style/workspaceStyle.css';
import { GrNotes } from 'react-icons/gr';
import DSwitch from './Elements/dSwitch';
import { GlobalStore } from '../../store';
import DCSource from './Elements/DCSource';
import Resistor from './Elements/resistor';
import Capacitor from './Elements/capacitor';
import { Instructions2 } from './instructions2';
import { AvatarLogo } from '../layout/AvatarLogo';
import { Button, message, Popconfirm } from 'antd';
import Galvanometer from './Elements/Galvanometer';
import { WarningOutlined } from '@ant-design/icons';
import { createSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import CustomConnectionLine from '../CommonElements/CustomConnectionLine';
import { BsFillPlayFill, BsStopFill, BsFillTrashFill } from 'react-icons/bs';
import { Controls, ReactFlow, useEdgesState, useNodesState, ReactFlowProvider, addEdge, updateEdge, ControlButton } from 'reactflow';

const nodeTypes = {
    Lamp: Lamp,
    DSwitch: DSwitch,
    Resistor: Resistor,
    DCSource: DCSource,
    Capacitor: Capacitor,
    Galvanometer: Galvanometer
};

let capInterval;
let galInterval;

function startCapInterval({ Func, time }) {
    capInterval = setInterval(Func, time);
}
function startGalInterval({ Func, time }) {
    galInterval = setInterval(Func, time);
}

function stopCapInterval() {
    clearInterval(capInterval);
}
function stopGalInterval() {
    clearInterval(galInterval);
}

const Workspace2 = (props) => {


    const navigate = useNavigate();

    const reactFlowWrapper = useRef(null);

    const [lampId, setLampId] = useState(0);

    const edgeUpdateSuccessful = useRef(true);

    const [messageApi, contextHolder] = message.useMessage();

    const [chargingCircuit, setChargingCircuit] = useState(0);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [ShowInstructions, setShowInstructions] = useState(false);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [SelectedItem, setSelectedItem] = useState({
        nodes: [],
        edges: []
    });

    const lampsId = useRef([
        {
            id: 'lampId0',
            status: false
        },
        {
            id: 'lampId1',
            status: false
        }
    ]);

    const {
        setLamp,
        setLambOn,
        setDSwitch,
        setResistor,
        setDCSource,
        setCapacitor,
        dSwitchStatus,
        setGalvanometer,
        setRun, Run,
        setGalvanometerDir,
        setRunError, RunError,
        setCapImgIdx, capImgIdx,
    } = GlobalStore();

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

    const chargingCircuitsPossibility = [
        [
            "cS_dsMiddle",
            "gS_cT",
            "lS_gT0",
            "rS_lT",
            "dcS_rT",
            "dsBottom_dcT",
        ],
        [
            "cS_dsMiddle",
            "gS_cT",
            "lS_gT1",
            "rS_lT",
            "dcS_rT",
            "dsBottom_dcT",
        ]
    ];

    const dischargingCircuitsPossibility = [
        [
            "cS_dsMiddle",
            "gS_cT",
            "lS_gT1",
            "dsTop_lT",
        ],
        [
            "cS_dsMiddle",
            "gS_cT",
            "lS_gT0",
            "dsTop_lT",
        ]
    ];

    const getId = (type) => {
        if (type == 'DSwitch') {
            setDSwitch(true)
            return `switchId1`
        } else if (type == 'Lamp') {
            if (lampId == 0) {
                setLampId(prev => ++prev)
                lampsId.current[0].status = true;
                return `lampId0`
            } else if (lampId == 1) {
                setLamp(true)
                setLampId(prev => ++prev)
                if (lampsId.current[0].status == false) {
                    lampsId.current[0].status = true
                    return `lampId0`
                } else if (lampsId.current[1].status == false) {
                    lampsId.current[1].status = true
                    return `lampId1`
                }
            }
            return
        } else if (type == 'DCSource') {
            setDCSource(true)
            return `sourceId1`
        } else if (type == 'Capacitor') {
            setCapacitor(true)
            return `capacitorId1`
        } else if (type == 'Resistor') {
            setResistor(true)
            return `resistorId1`
        } else if (type == 'Galvanometer') {
            setGalvanometer(true)
            return `galvanometerId1`
        }
    };

    const connectionLineStyle = {
        strokeWidth: 1.5,
        stroke: 'black',
        type: 'smoothstep',
    };

    const onDeleteNode = useCallback((e) => {
        StopFunc()
        if (e[0].type == 'DSwitch') {
            setDSwitch(false)
            return
        } else if (e[0].type == 'Lamp') {
            if (e[0].id == "lampId0") {
                lampsId.current[0].status = false;
            }
            if (e[0].id == "lampId1") {
                lampsId.current[1].status = false;
            }
            setLampId(prev => --prev);
            setLamp(false)
            return
        } else if (e[0].type == 'DCSource') {
            setDCSource(false)
            return
        } else if (e[0].type == 'Capacitor') {
            setCapacitor(false)
            return
        } else if (e[0].type == 'Resistor') {
            setResistor(false)
            return
        } else if (e[0].type == 'Galvanometer') {
            setGalvanometer(false)
            return
        }
        return
    }, [lampId]);

    const onDeleteEdge = useCallback(() => {
        StopFunc()
        return
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

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
        }, [reactFlowInstance, lampId]);

    const onConnect = useCallback((params) => {
        params.id =
            params.source == 'lampId0' ? params.sourceHandle + "_" + params.targetHandle + "0"
                : params.source == 'lampId1' ? params.sourceHandle + "_" + params.targetHandle + "1"
                    : params.sourceHandle + "_" + params.targetHandle;
        params.type = 'smoothstep'
        params.style = {
            strokeWidth: 1.5,
            stroke: 'rgba(0,0,0,1)',
        }
        setEdges((eds) => addEdge(params, eds))
        if (params.target == 'lampId0') {
            if (params.source == 'resistorId1') {
                setChargingCircuit(0);
            } else {
                setChargingCircuit(1);
            }
        }
    }, []);

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

    const checkConnections = (edges) => {
        const correctConnections = [
            "rS_lT",
            "gS_cT",
            "lS_gT0",
            "lS_gT1",
            "dcS_rT",
            "dsTop_lT",
            "dsTop_lT",
            "cS_dsMiddle",
            "dsBottom_dcT",
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
    };

    const RunFunc = useCallback(() => {
        if (nodes.length == 7) {
            if (edges.length == 8) {
                let status = checkConnections(edges) > 0 ? false : true;
                if (status == true) {
                    setRun(true)
                    Message({
                        content: 'الدائرة جاهزة لتنفيذ التجربة',
                        type: 'success'
                    })
                    if (dSwitchStatus === 1) {
                        StartRunning(0, true);
                    } else {
                        StartRunning(360, true);
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
    }, [edges, nodes]);

    const StopFunc = () => {
        setRun(false)
        StopRunning(0);
    };

    const StartRunning = (cctNum, direct = false) => {
        if (Run || direct) {
            let capCounter = capImgIdx;
            let galCounter = cctNum;
            StopRunning(cctNum);
            if (cctNum === 0) {
                if (capImgIdx < 10) {
                    startAnimation(cctNum);
                    startGalInterval({
                        Func: () => {
                            if (galCounter < 60) {
                                galCounter = galCounter + 10;
                                setGalvanometerDir(galCounter);
                            } else {
                                stopGalInterval();
                            }
                        },
                        time: 0
                    });
                    setLambOn(chargingCircuit === 0 ? 'lampId0' : 'lampId1');
                    startCapInterval({
                        Func: () => {
                            if (capCounter == 10) {
                                StopRunning(0);
                            } else {
                                capCounter = capCounter + 1;
                                setCapImgIdx(capCounter);
                            }
                        },
                        time: 1000
                    });
                }
            } else {
                if (capImgIdx > 0) {
                    startAnimation(cctNum);
                    startGalInterval({
                        Func: () => {
                            if (galCounter > 300) {
                                galCounter = galCounter - 10;
                                setGalvanometerDir(galCounter);
                            } else {
                                stopGalInterval(360);
                            }
                        },
                        time: 0
                    });
                    setLambOn(chargingCircuit === 0 ? 'lampId1' : 'lampId0');
                    startCapInterval({
                        Func: () => {
                            if (capCounter == 0) {
                                StopRunning(360);
                            } else {
                                capCounter = capCounter - 1;
                                setCapImgIdx(capCounter);
                            }
                        },
                        time: 1000
                    });
                }
            }
        }
    }

    const StopRunning = (galVal) => {
        setGalvanometerDir(galVal);
        setLambOn('none');
        StopAnimation();
        stopCapInterval();
        stopGalInterval();
    }

    const startAnimation = useCallback((cctNum) => {
        let animatedEdges;
        if (cctNum === 0) {
            animatedEdges = edges.map((edge) => {
                if (chargingCircuitsPossibility[chargingCircuit].includes(edge.id)) {
                    edge.type = 'smoothstep'
                    edge.animated = true
                    edge.style = {
                        strokeWidth: 1.5,
                        stroke: '#FF0072',
                    }
                }
                return edge
            })
        } else {
            animatedEdges = edges.map((edge) => {
                if (dischargingCircuitsPossibility[chargingCircuit].includes(edge.id)) {
                    edge.type = 'smoothstep'
                    edge.animated = true
                    edge.style = {
                        strokeWidth: 1.5,
                        stroke: '#FF0072',
                    }
                }
                return edge
            })
        }
        setEdges(animatedEdges);
    }, [edges, nodes]);

    const StopAnimation = useCallback(() => {
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
    }, [edges, nodes]);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'switchId1') {
                    node.data = {
                        ...node.data, StartRunning
                    }
                }
                return node;
            })
        );
    }, [setNodes, Run, StartRunning]);

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
            <Instructions2 ShowInstructions={ShowInstructions} setShowInstructions={setShowInstructions} />
            <ReactFlowProvider>
                <aside style={{ width: '100px', backgroundColor: "#F1F1F2", borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '2px' }} className='absolute top-32 bottom-32 right-4 shadow-xl z-10 flex flex-col items-center overflow-x-hidden overflow-y-auto rounded-lg' >
                    <ExpSB2 />
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
                                    search: `?${createSearchParams({ exp: 1 })}`
                                })}
                                style={{ color: 'white', borderColor: 'rgba(57, 138, 185,0.8)', borderWidth: '1px', background: 'orange' }}
                            >
                                إختبر نفسك !
                            </Button>
                        </div>
                    </div>
                </aside>
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
                        onEdgesDelete={onDeleteEdge}
                        onNodesDelete={onDeleteNode}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onInit={setReactFlowInstance}
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
                                        }}
                                    >
                                        <BsFillTrashFill />
                                    </ControlButton>
                                ) : null
                            }
                        </Controls >
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
}

export default Workspace2;