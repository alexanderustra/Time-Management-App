export interface Task {
  title: string;
  completed: boolean;
}

export interface ListMenuProps {
  index: number;
  handleCompleted: (index: number) => void;
  handleDelete: (index: number) => void;
}

export interface ToDoProps {
  showModal: (value: boolean) => void;
  handleCreateTask: (title: string) => void;
}
