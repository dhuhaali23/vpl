/* eslint-disable jsx-a11y/img-redundant-alt */
import { Image } from "antd";
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { HiMinus, HiPlus } from "react-icons/hi";
import styles from '../../../style/style.module.css';
import needle from "../../../assets/images/needle.svg";
import { Handle, useUpdateNodeInternals } from 'reactflow';
import hCircle from "../../../assets/images/halfCircle.png";
import React, { useEffect, useState, useRef, memo } from 'react';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";
import { GlobalStore } from "../../../store";


function Galvanometer({ id, data }) {
    const rotateControlRef = useRef(null);
    const updateNodeInternals = useUpdateNodeInternals();
    const [rotation, setRotation] = useState(0);
    const { direction } = data
    const { galvanometerDir } = GlobalStore();
    useEffect(() => {
        if (!rotateControlRef.current) {
            return;
        }
        const selection = select(rotateControlRef.current);
        const dragHandler = drag().on('drag', (evt) => {
            const dx = evt.x - 100;
            const dy = evt.y - 100;
            const rad = Math.atan2(dx, dy);
            const deg = rad * (180 / Math.PI);
            setRotation(180 - deg);
            updateNodeInternals(id);
        });
        selection.call(dragHandler);
    }, [id, updateNodeInternals, direction]);

    return (
        <>
            <div
                style={{
                    transform: `rotate(${rotation}deg)`,
                }}
                className={styles.node}
            >
                <div
                    ref={rotateControlRef}
                    style={{
                        display: 'block',
                    }}
                    className={`nodrag ${styles.rotateHandle}`}
                >
                    <Image preview={false} src={switchCueArrow} />
                </div>
                <Handle
                    id="gS"
                    style={{ height: 10, width: 10, background: 'red', borderColor: '#F1F1F2', marginLeft: 30, marginBottom: 10 }}
                    className=" z-50 " type="source" position="bottom" />
                <Handle
                    id="gT"
                    style={{ height: 10, width: 10, background: 'blue', borderColor: '#F1F1F2', marginLeft: -30, marginBottom: 10 }}
                    className=" z-50 " type="target" position="bottom" />
                <div className=" flex flex-col justify-center items-center " style={{ height: 95, width: 110, borderRadius: '8px', background: '#546F7A' }} >
                    <div
                        style={{
                            background: '#546F7A',
                            height: '42px',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px'

                        }}
                    ></div>
                </div>
                <div
                    style={{
                        background: 'rgba(38, 50, 56, 0.20)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(0px)',
                        WebkitBackdropFilter: 'blur(0px)',
                        border: '1px solid rgba(38, 50, 56, 0.43)',
                        borderRadius: '8px 8px 0 0',
                        position: 'absolute',
                        bottom: 39,
                        top: 4,
                        right: 4,
                        left: 4,
                        zIndex: 110

                    }}
                >
                    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <svg style={{ height: '100%', width: '100%' }}>
                            <circle r="60%" cx="50%" cy="100%" fill="#F1F1F2" stroke="#F1F1F2" strokeWidth="3"></circle>
                        </svg>
                        {/* 60(right) OR 300(left) */}
                        <img alt="" src={needle} style={{ height: 33, position: 'absolute', bottom: 3, transformOrigin: 'bottom center', transform: `rotate(${galvanometerDir}deg)` }} />
                        <img alt="" src={hCircle} style={{ position: 'absolute', top: 0 }} />
                    </div>
                </div>
                <HiPlus style={{
                    position: 'absolute',
                    right: 17,
                    bottom: 20,
                    color: '#263238'
                }} />
                <HiMinus style={{
                    position: 'absolute',
                    left: 17,
                    bottom: 20,
                    color: '#263238'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 40,
                    right: 40,
                    height: 20,
                    borderRadius: 5,
                    background: "#F1F1F2",
                    fontSize: 15,
                    fontWeight: 'bolder',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid rgba(38, 50, 56, 0.43)',
                    color: '#263238'

                }} >
                    <span>G</span>
                </div>
            </div>
        </>
    );
}

export default memo(Galvanometer);
