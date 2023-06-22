import { Image } from "antd";
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import React, { useEffect, useState, useRef, memo } from 'react';
import { Handle, useUpdateNodeInternals } from 'reactflow';
////////////////////////////////////////////////////////////////
import r1Cap0 from "../../../assets/images/capacity/rightCap/0.png";
import r1Cap1 from "../../../assets/images/capacity/rightCap/1.png";
import r1Cap2 from "../../../assets/images/capacity/rightCap/2.png";
import r1Cap3 from "../../../assets/images/capacity/rightCap/3.png";
import r1Cap4 from "../../../assets/images/capacity/rightCap/4.png";
import r1Cap5 from "../../../assets/images/capacity/rightCap/5.png";
import r1Cap6 from "../../../assets/images/capacity/rightCap/6.png";
import r1Cap7 from "../../../assets/images/capacity/rightCap/7.png";
import r1Cap8 from "../../../assets/images/capacity/rightCap/8.png";
import r1Cap9 from "../../../assets/images/capacity/rightCap/9.png";
import r1Cap10 from "../../../assets/images/capacity/rightCap/10.png";
/////////////////////////////////////////////////////////////
import l1Cap0 from "../../../assets/images/capacity/leftCap/0.png";
import l1Cap1 from "../../../assets/images/capacity/leftCap/1.png";
import l1Cap2 from "../../../assets/images/capacity/leftCap/2.png";
import l1Cap3 from "../../../assets/images/capacity/leftCap/3.png";
import l1Cap4 from "../../../assets/images/capacity/leftCap/4.png";
import l1Cap5 from "../../../assets/images/capacity/leftCap/5.png";
import l1Cap6 from "../../../assets/images/capacity/leftCap/6.png";
import l1Cap7 from "../../../assets/images/capacity/leftCap/7.png";
import l1Cap8 from "../../../assets/images/capacity/leftCap/8.png";
import l1Cap9 from "../../../assets/images/capacity/leftCap/9.png";
import l1Cap10 from "../../../assets/images/capacity/leftCap/10.png";
///////////////////////////////////////////////////////////////
import r2Cap0 from "../../../assets/images/capacity/rightCapReverse/0.png";
import r2Cap1 from "../../../assets/images/capacity/rightCapReverse/1.png";
import r2Cap2 from "../../../assets/images/capacity/rightCapReverse/2.png";
import r2Cap3 from "../../../assets/images/capacity/rightCapReverse/3.png";
import r2Cap4 from "../../../assets/images/capacity/rightCapReverse/4.png";
import r2Cap5 from "../../../assets/images/capacity/rightCapReverse/5.png";
import r2Cap6 from "../../../assets/images/capacity/rightCapReverse/6.png";
import r2Cap7 from "../../../assets/images/capacity/rightCapReverse/7.png";
import r2Cap8 from "../../../assets/images/capacity/rightCapReverse/8.png";
import r2Cap9 from "../../../assets/images/capacity/rightCapReverse/9.png";
import r2Cap10 from "../../../assets/images/capacity/rightCapReverse/10.png";
/////////////////////////////////////////////////////////////
import l2Cap0 from "../../../assets/images/capacity/leftCapReverse/0.png";
import l2Cap1 from "../../../assets/images/capacity/leftCapReverse/1.png";
import l2Cap2 from "../../../assets/images/capacity/leftCapReverse/2.png";
import l2Cap3 from "../../../assets/images/capacity/leftCapReverse/3.png";
import l2Cap4 from "../../../assets/images/capacity/leftCapReverse/4.png";
import l2Cap5 from "../../../assets/images/capacity/leftCapReverse/5.png";
import l2Cap6 from "../../../assets/images/capacity/leftCapReverse/6.png";
import l2Cap7 from "../../../assets/images/capacity/leftCapReverse/7.png";
import l2Cap8 from "../../../assets/images/capacity/leftCapReverse/8.png";
import l2Cap9 from "../../../assets/images/capacity/leftCapReverse/9.png";
import l2Cap10 from "../../../assets/images/capacity/leftCapReverse/10.png";
///////////////////////////////////////////////////////////////
import insulator from '../../../assets/images/capacity/insulator.png';
import styles from '../../../style/style.module.css';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";
import { GlobalStore } from "../../../store";

const capacitance = [
    [
        {
            right: r1Cap0,
            left: l1Cap0
        },
        {
            right: r1Cap1,
            left: l1Cap1
        },
        {
            right: r1Cap2,
            left: l1Cap2
        },
        {
            right: r1Cap3,
            left: l1Cap3
        },
        {
            right: r1Cap4,
            left: l1Cap4
        },
        {
            right: r1Cap5,
            left: l1Cap5
        },
        {
            right: r1Cap6,
            left: l1Cap6
        },
        {
            right: r1Cap7,
            left: l1Cap7
        },
        {
            right: r1Cap8,
            left: l1Cap8
        },
        {
            right: r1Cap9,
            left: l1Cap9
        },
        {
            right: r1Cap10,
            left: l1Cap10
        },
    ],
    [
        {
            right: r2Cap0,
            left: l2Cap0
        },
        {
            right: r2Cap1,
            left: l2Cap1
        },
        {
            right: r2Cap2,
            left: l2Cap2
        },
        {
            right: r2Cap3,
            left: l2Cap3
        },
        {
            right: r2Cap4,
            left: l2Cap4
        },
        {
            right: r2Cap5,
            left: l2Cap5
        },
        {
            right: r2Cap6,
            left: l2Cap6
        },
        {
            right: r2Cap7,
            left: l2Cap7
        },
        {
            right: r2Cap8,
            left: l2Cap8
        },
        {
            right: r2Cap9,
            left: l2Cap9
        },
        {
            right: r2Cap10,
            left: l2Cap10
        },
    ]
]
function Capacitor({ id, data }) {
    const rotateControlRef = useRef(null);
    const updateNodeInternals = useUpdateNodeInternals();
    const [rotation, setRotation] = useState(0);
    const {capImgIdx, capGroup, theInsulator} = GlobalStore();
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
                        className="mr-1 z-50 " type="source" position="right" />
                    <Handle
                        id="cT"
                        style={{ background: 'blue', marginLeft: '8.4px', borderColor: 'blue', height: 7, width: 7 }}
                        className="ml-1 z-50 " type="target" position="left" />
                    <div className="absolute z-10 " >
                        <img alt="" src={capacitance[capGroup][capImgIdx].left} />
                    </div>
                    {
                        theInsulator && (
                            <div className="absolute animate__animated animate__slideInDown " >
                                <img alt="" src={insulator} />
                            </div>
                        )
                    }
                    <div>
                        <img alt="" src={capacitance[capGroup][capImgIdx].right} />
                    </div>
                </div>
            </div>

        </>
    );
}

export default memo(Capacitor);
