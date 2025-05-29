import { useEffect ,useState} from "react";
import { Select } from "../../components/Select";

interface CreationModalProps {
  setCurrentMenuIndex: (index: number | null) => void;
  setShowModal: (value: boolean) => void;
  setAllTasks: (tasks: Task[]) => void;
  allTasks: Task[];
  index?: number | null;
}

  interface Task {
    description: string;
    hour: string;
    minutes: string;
    completed: boolean | null;
  }

export const NewTaskModal = ({ index,allTasks,setAllTasks,setShowModal,setCurrentMenuIndex }: CreationModalProps) => {
    const [description, setDescription] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');

    const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutesOptions = Array.from({ length: 61 }, (_, i) => (i).toString().padStart(2, '0'));

    useEffect(() => {
      if (index !== null && index !== undefined) {
        const task = allTasks[index];
        setDescription(task.description);
        setHour(task.hour);
        setMinutes(task.minutes);
      } else {
        setDescription('');
        setHour('10');
        setMinutes('30');
      }
    }, [index]);

    const handleSubmit = () => {
      if (!description.trim()) {
        return; 
      }

      const updatedTasks = [...allTasks];
      if (index !== null && index !== undefined) {
        updatedTasks[index] = { description, hour, minutes, completed: null };
      } else {
        updatedTasks.push({ description, hour, minutes, completed: null });
      }
      
      setAllTasks(updatedTasks);
      setShowModal(false);
      setCurrentMenuIndex(null);
    };

    return (
      <div onClick={(e)=>{
        e.stopPropagation()
      }} id="routineModal" className="creationModal" >
        <h2>New Task</h2>
        <textarea
          style={{ borderColor: description.trim() ? '#EDEAE5' : '#EC6767' }}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
        <div id="inputsContainer">
          <Select  
            onSelect={(e:any) => setHour(e)}
            placeholder="10"
            >
              {hoursOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </Select>
          <Select  
            onSelect={(e:any) => setMinutes(e)}
            placeholder="30"
            >
              {minutesOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
          </Select>
        </div>
       <div id="buttonsContainer">
       <button onClick={handleSubmit}>Add</button>
       <button onClick={()=>setShowModal(false)}>Cancel</button>
       </div>
      </div>
    );
  };