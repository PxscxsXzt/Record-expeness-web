import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export function useExpense() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('expenseRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenseRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (record) => {
    setRecords((prev) => [...prev, { ...record, id: Date.now() }]);
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const clearRecords = () => {
    if(window.confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
      setRecords([]);
    }
  };

  return (
    <ExpenseContext.Provider value={{ records, addRecord, deleteRecord, clearRecords }}>
      {children}
    </ExpenseContext.Provider>
  );
}
