
import { create } from "zustand";

export const GlobalStore = create((set) =>
({
    Run: false,
    setRun: (Run) => set({ Run }), //All

    RunError: false,
    setRunError: (RunError) => set({ RunError }), //All

    DSwitch: false,
    setDSwitch: (DSwitch) => set({ DSwitch }), //Exp2

    SingeSwitch: false,
    setSingeSwitch: (SingeSwitch) => set({ SingeSwitch }), //Exp1, Exp3, Exp4, Exp5, Exp6

    switchStatus: false,
    setSwitchStatus: (switchStatus) => set({ switchStatus }), //Exp1, Exp3, Exp4, Exp5, Exp6

    lambOn: 'none',
    setLambOn: (lambOn) => set({ lambOn }), //Exp2

    galvanometerDir: 0,
    setGalvanometerDir: (galvanometerDir) => set({ galvanometerDir }), //Exp2

    dSwitchStatus: 2,
    setDSwitchStatus: (dSwitchStatus) => set({ dSwitchStatus }), //Exp2

    Capacitor: false,
    setCapacitor: (Capacitor) => set({ Capacitor }), //Exp1, Exp2, Exp5, Exp6

    capImgIdx: 0,
    setCapImgIdx: (capImgIdx) => set({ capImgIdx }), // Exp1, Exp5, Exp6

    capGroup: 0,
    setCapGroup: (capGroup) => set({ capGroup }), //Exp5, Exp6

    capacity: 0.05,
    setCapacity: (capacity) => set({ capacity }), //Exp5, Exp6

    theInsulator: false,
    setTheInsulator: (theInsulator) => set({ theInsulator }), //Exp1, Exp6

    DCSource: false,
    setDCSource: (DCSource) => set({ DCSource }), //Exp1, Exp2

    Voltmeter: false,
    setVoltmeter: (Voltmeter) => set({ Voltmeter }), //Exp1, Exp3, Exp4, Exp5, Exp6

    theVoltage: 0,
    setTheVoltage: (theVoltage) => set({ theVoltage }), //Exp1

    voltmeterValue: 0.001,
    setVoltmeterValue: (voltmeterValue) => set({ voltmeterValue }), //Exp1

    voltage: 0,
    setVoltage: (voltage) => set({ voltage }), //Exp3, Exp4, Exp5, Exp6

    currentStep: 0,
    setCurrentStep: (currentStep) => set({ currentStep }), //Exp1

    Lamp: false,
    setLamp: (Lamp) => set({ Lamp }), //Exp2

    Resistor: false,
    setResistor: (Resistor) => set({ Resistor }), //Exp2

    Galvanometer: false,
    setGalvanometer: (Galvanometer) => set({ Galvanometer }), //Exp2

    Inductor: false,
    setInductor: (Inductor) => set({ Inductor }), //Exp3, Exp4

    inductionFactor: 1,
    setInductionFactor: (inductionFactor) => set({ inductionFactor }), //Exp3, Exp4

    ACSource: false,
    setACSource: (ACSource) => set({ ACSource }), //Exp3, Exp4, Exp5, Exp6

    Ammeter: false,
    setAmmeter: (Ammeter) => set({ Ammeter }), //Exp3, Exp4, Exp5, Exp6

    frequency: 0.10,
    setFrequency: (frequency) => set({ frequency }), //Exp3, Exp4, Exp5, Exp6

    theCurrent: 0,
    setTheCurrent: (theCurrent) => set({ theCurrent }), //Exp3, Exp4, Exp5, Exp6

}))

export const resetGlobalStore = () => {
    GlobalStore.setState({
      Run: false,
      RunError: false,
      DSwitch: false,
      SingeSwitch: false,
      switchStatus: false,
      lambOn: 'none',
      galvanometerDir: 0,
      dSwitchStatus: 2,
      Capacitor: false,
      capImgIdx: 0,
      capGroup: 0,
      capacity: 0.05,
      theInsulator: false,
      DCSource: false,
      Voltmeter: false,
      theVoltage: 0,
      voltmeterValue: 0.001,
      voltage: 0,
      currentStep: 0,
      Lamp: false,
      Resistor: false,
      Galvanometer: false,
      Inductor: false,
      inductionFactor: 1,
      ACSource: false,
      Ammeter: false,
      frequency: 0.10,
      theCurrent: 0,
    });
  };