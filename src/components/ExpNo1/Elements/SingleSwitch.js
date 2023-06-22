import React, { useEffect, useState, useRef, memo } from 'react';
import { Handle, useUpdateNodeInternals } from 'reactflow';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import styles from '../../../style/style.module.css';
import { Image } from 'antd';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";
import openKey from "../../../assets/images/openKey.png";
import closeKey from "../../../assets/images/closeKey.png";
import { GlobalStore } from '../../../store';
function SingeSwitch({ id, isConnectable, data }) {
    const rotateControlRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const updateNodeInternals = useUpdateNodeInternals();
    const { Run, setRunError, switchStatus, setSwitchStatus, capImgIdx } = GlobalStore();
    const {
        startCct1Running,
        stopCct1Running,
    } = data

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
    }, [id, updateNodeInternals, switchStatus]);

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
                <div
                    style={{ width: "65px" }}
                    className=" flex items-center justify-center switchKey "
                    onClick={() => {
                        if (Run) {
                            if (switchStatus === false) {
                                setSwitchStatus(true)
                                startCct1Running(capImgIdx)
                            } else {
                                setSwitchStatus(false)
                                stopCct1Running()
                            }
                        } else {
                            setRunError(true)
                        }


                    }}

                >
                    <Handle
                        id='swS'
                        style={{
                            background: 'red',
                            marginTop: '1.5px',
                            marginRight: '8px',
                            height: 6.5,
                            width: 6.5,
                            borderColor: 'red'
                        }}
                        isConnectable={isConnectable} className="z-50 " type="source" position="right" />
                    <Handle
                        id='swT'
                        style={{
                            background: 'blue',
                            marginTop: '1.5px',
                            marginLeft: '4px',
                            height: 6.5,
                            width: 6.5,
                            borderColor: 'blue'
                        }}
                        isConnectable={isConnectable}
                        className="z-50" type="target" position="left" />

                    <Image  preview={false} src={switchStatus === true ? closeKey : openKey} />
                </div>
            </div>
        </>
    );
}
export default memo(SingeSwitch);