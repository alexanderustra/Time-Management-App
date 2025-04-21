export interface CreationModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerOn:React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Errors {
    end: string;
    timelines: string[];
    pauses: { start: string; end: string }[];
  }
  export interface Timeline {
      title: string;
      time: number;
    }
    
    export interface Pause {
      start: number;
      end: number;
    }
    
    export interface Data {
      end: number;
      elapsed: number;
      timelines: Timeline[];
      pauses: Pause[];
    }