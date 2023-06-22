import { Image } from 'antd';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { GlobalStore } from '../../../store';
import styles from '../../../style/style.module.css';
import bulbOn from '../../../assets/images/bulbOn.png';
import bulbOff from '../../../assets/images/bulbOff.png';
import { Handle, useUpdateNodeInternals } from 'reactflow';
import React, { useEffect, useState, useRef, memo } from 'react';
import switchCueArrow from "../../../assets/images/switchCueArrow.png";


function Lamp({ id }) {

    const rotateControlRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const updateNodeInternals = useUpdateNodeInternals();
    const { lambOn } = GlobalStore();
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
                        marginTop: 60,
                        marginLeft: 50
                    }}
                    className={`nodrag ${styles.rotateHandle}`}

                >
                    <Image preview={false} src={switchCueArrow} />
                </div>
                <div
                    style={{ width: "200px" }}
                    className=" flex items-center justify-center "
                >
                    <Handle
                        id="lT"
                        type="target"
                        position="right"
                        style={{
                            background: 'blue',
                            zIndex: 50,
                            marginTop: 28,
                            marginRight: 93,
                            borderColor: 'blue',
                            width: 22,
                            height: 0,
                            borderRadius: '2px',
                        }}
                    />
                    <Handle
                        id="lS"
                        type="source"
                        position="bottom"
                        style={{
                            background: 'red',
                            zIndex: 50,
                            marginBottom: 53.8,
                            marginLeft: 0.2,
                            borderColor: 'red',
                            height: 0,
                            width: 11.5,
                            borderRadius: '0 0 8px 8px',
                        }}
                    />
                    <img alt='' src={lambOn === id ? bulbOn : bulbOff} />
                </div>
            </div>
        </>
    );
}
export default memo(Lamp);
