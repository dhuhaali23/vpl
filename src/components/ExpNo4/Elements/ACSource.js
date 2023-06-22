import { Handle, useUpdateNodeInternals } from 'reactflow';
import { HiMinus, HiPlus } from "react-icons/hi";
import React, { useEffect, memo } from 'react';
import SineWaves from 'sine-waves';
import { GlobalStore } from '../../../store';

function ACSource({ id, data }) {
    const updateNodeInternals = useUpdateNodeInternals();
    const { frequency, voltage } = GlobalStore();

    useEffect(() => {
        new SineWaves({
            el: document.getElementById('waves'),
            speed: 4,
            ease: 'Linear',
            wavesWidth: '200%',
            waves: [
                {
                    timeModifier: 5,
                    lineWidth: 1,
                    amplitude: voltage,
                    wavelength: 1 / frequency,
                    strokeStyle: 'rgba(2, 2, 2, 0.8)'
                }
            ],
        });
    }, [id, updateNodeInternals, frequency, voltage]);


    return (
        <>
            <div
                style={{
                    height: '110px',
                    width: '150px',
                    background: '#546F7A',
                    borderRadius: '5px',
                    borderWidth: '1.5px',
                    borderColor: '#263238',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: "10px",
                        bottom: '10px',
                        right: '10px',
                        left: '10px',
                        zIndex: 999,
                    }}
                >
                    <div
                        style={{
                            height: '65px',
                            backgroundColor: "white",
                            borderRadius: '3px',
                            borderWidth: '1.5px',
                            borderColor: '#263238',
                        }}
                    >
                        <canvas
                            style={{
                                width: "100%",
                                height: '100%',
                            }} id='waves'></canvas>
                    </div>
                    <div
                        className=" flex  justify-around items-center "
                        style={{
                            marginTop: '2px',
                            height: '25px',
                        }}
                    >
                        <div className='h-full w-full flex justify-between items-center' >
                            <div className='h-full flex flex-col justify-between items-center ' >
                                <HiPlus color='#263238' />
                                <span className=' rounded-full' style={{ background: '#263238', height: '10px', width: '10px' }} ></span>
                            </div>
                            <div className='h-full flex justify-center items-center' >
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    background: '#CFD8DC',
                                    paddingLeft: '5px',
                                    paddingRight: '5px',
                                    borderRadius: '5px',
                                    borderWidth: '1.5px',
                                    borderColor: '#263238'

                                }} >OSCILLATOR</span>
                            </div>
                            <div className='h-full flex flex-col justify-between items-center ' >
                                <HiMinus color='#263238' />
                                <span className=' rounded-full' style={{ background: '#263238', height: '10px', width: '10px' }} ></span>
                            </div>
                        </div>

                    </div>
                </div>
                <Handle
                    id="acT"
                    style={{
                        background: 'blue',
                        borderColor: 'blue',
                        zIndex: 1000,
                        right: "13.2px",
                        top: '97px',
                        height: 10,
                        width: 10,
                    }}
                    type="target"
                    position="right"
                />

                <Handle
                    id="acS"
                    style={{
                        background: 'red',
                        borderColor: 'red',
                        zIndex: 1000,
                        left: "13.2px",
                        top: '97px',
                        height: 10,
                        width: 10,
                    }}
                    className=" z-50 "
                    type="source"
                    position="left"
                />
            </div>
        </>
    );
}
export default memo(ACSource);