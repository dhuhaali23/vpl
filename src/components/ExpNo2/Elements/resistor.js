

import { Image } from "antd";

import resistor from "../../../assets/images/resistor.png";

import React, { useEffect, useState, useRef, memo } from 'react';
import { Handle, useUpdateNodeInternals } from 'reactflow';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import styles from '../../../style/style.module.css';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";

function Resistor({ id }) {
    const rotateControlRef = useRef(null);
    const updateNodeInternals = useUpdateNodeInternals();
    const [rotation, setRotation] = useState(0);
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
    }, [id, updateNodeInternals]);

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
                    style={{ width: "70px" }}
                    className=" flex items-center justify-center "
                >
                    <Handle
                        id="rT"
                        style={{ background: 'blue', borderColor:'blue' }}
                        className=" z-50 " type="target" position="right" />
                    <Handle
                        id="rS"
                        style={{ background: 'red', borderColor:'red' }}
                        className=" z-50 " type="source" position="left" />
                    <Image preview={false} src={resistor} className="" />
                </div>
            </div>
        </>
    );
}
export default memo(Resistor);