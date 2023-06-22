import { Image } from "antd";
import React, { useEffect, useState, useRef, memo } from 'react';
import { Handle, useUpdateNodeInternals } from 'reactflow';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import styles from '../../../style/style.module.css';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";
import capacity0 from "../../../assets/images/capacity/0.png";
import capacity1 from "../../../assets/images/capacity/1.png";
import capacity2 from "../../../assets/images/capacity/2.png";
import capacity3 from "../../../assets/images/capacity/3.png";
import capacity4 from "../../../assets/images/capacity/4.png";
import capacity5 from "../../../assets/images/capacity/5.png";
import capacity6 from "../../../assets/images/capacity/6.png";
import capacity7 from "../../../assets/images/capacity/7.png";
import capacity8 from "../../../assets/images/capacity/8.png";
import capacity9 from "../../../assets/images/capacity/9.png";
import capacity10 from "../../../assets/images/capacity/10.png";
import { GlobalStore } from "../../../store";
const capacitance = [
    capacity0,
    capacity1,
    capacity2,
    capacity3,
    capacity4,
    capacity5,
    capacity6,
    capacity7,
    capacity8,
    capacity9,
    capacity10,
];

function Capacitor({ id }) {

    const { capImgIdx } = GlobalStore();
    const rotateControlRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const updateNodeInternals = useUpdateNodeInternals();

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
                    style={{ width: "75px" }}
                    className=" flex items-center justify-center "
                >
                    <Handle
                        id='cS'
                        style={{ background: 'red', marginRight: '5.5px', borderColor: 'red', height: 7, width: 7 }}
                        className=" z-50 " type="source" position="right" />
                    <Handle
                        id="cT"
                        style={{ background: 'blue', marginLeft: '8.4px', marginTop: '0.2px', borderColor: 'blue', height: 7, width: 7 }}
                        className=" z-50 " type="target" position="left" />
                    <Image preview={false} src={capacitance[capImgIdx]} className="z-50 " />
                </div>
            </div>

        </>
    );
}

export default memo(Capacitor);
