import React from 'react';
import singeSwitch from '../../assets/images/openKey.png';
import capacitor from '../../assets/images/capacity/0.png';
import ACSourceIco from '../../assets/images/AC.png';
import AmmeterIco from '../../assets/images/ammeter.png';
import VoltmeterIco from '../../assets/images/voltmeter.png';
import { GlobalStore } from '../../store';
import { Tooltip } from 'antd';


export const ExpSB5 = () => {
    let sidebarElement = 'w-14 h-14 flex flex-col justify-center items-center text-sm font-bold cursor-pointer '
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('data', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const { SingeSwitch, Capacitor, ACSource, Ammeter, Voltmeter } = GlobalStore();

    return (
        <>
            <Tooltip color={'rgba(57, 138, 185,0.8)'} placement='left' title={'مفتاح'} >
                <div
                    style={{ marginBottom: '30px', marginTop: '30px' }}
                    className={SingeSwitch ? `cursor-not-allowed opacity-50 ${sidebarElement} ` : sidebarElement}
                >
                    <div draggable={!SingeSwitch} onDragStart={(event) => {
                        onDragStart(event, 'SingeSwitch')
                    }}>
                        <img alt='' draggable={false} src={singeSwitch} />
                    </div>
                    <span className="mt-1" >Switch</span>
                </div>
            </Tooltip>
            <Tooltip color={'rgba(57, 138, 185,0.8)'} placement='left' title={'متسعة'} >
                <div
                    style={{ marginBottom: '30px', marginTop: '30px' }}
                    className={Capacitor === true ? `cursor-not-allowed opacity-50 ${sidebarElement}` : sidebarElement}
                >
                    <div draggable={Capacitor === true ? false : true} onDragStart={(event) => {
                        onDragStart(event, 'Capacitor')
                    }} >
                        <img alt='' draggable={false} src={capacitor} />
                    </div>
                    <span className="mt-1" >Capacitor</span>
                </div>
            </Tooltip>
            <Tooltip color={'rgba(57, 138, 185,0.8)'} placement='left' title={'اميتير'} >
                <div
                    style={{ marginBottom: '30px', marginTop: '30px' }}
                    className={Ammeter ? `cursor-not-allowed opacity-50 ${sidebarElement}` : sidebarElement}
                >
                    <div draggable={!Ammeter} onDragStart={(event) => {
                        onDragStart(event, 'Ammeter')
                    }} >
                        <img alt='' draggable={false} src={AmmeterIco} />
                    </div>
                    <span className="mt-1" >Ammeter</span>
                </div>
            </Tooltip>
            <Tooltip color={'rgba(57, 138, 185,0.8)'} placement='left' title={'فولتميتر'} >
                <div
                    style={{ marginBottom: '30px', marginTop: '30px' }}
                    className={Voltmeter ? `cursor-not-allowed opacity-50 ${sidebarElement}` : sidebarElement}
                >
                    <div draggable={!Voltmeter} onDragStart={(event) => {
                        onDragStart(event, 'Voltmeter')
                    }} >
                        <img alt='' draggable={false} src={VoltmeterIco} />
                    </div>
                    <span className="mt-1" >Voltmeter</span>
                </div>
            </Tooltip>
            <Tooltip color={'rgba(57, 138, 185,0.8)'} placement='left' title={'مذبذب كهربائي'} >
                <div
                    style={{ marginBottom: '30px', marginTop: '30px' }}
                    className={ACSource ? `cursor-not-allowed opacity-50 ${sidebarElement}` : sidebarElement}
                >
                    <div draggable={!ACSource} onDragStart={(event) => {
                        onDragStart(event, 'ACSource')
                    }} >
                        <img alt='' draggable={false} src={ACSourceIco} />
                    </div>
                    <span className="mt-1" >ACSource</span>
                </div>
            </Tooltip>
        </>
    )
}