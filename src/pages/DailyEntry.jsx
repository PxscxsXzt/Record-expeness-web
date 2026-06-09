import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

function DailyEntry() {
  const { records, addRecord, deleteRecord } = useExpense();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    income: '',
    expense: '',
    isReimbursable: false,
    note: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date) {
      alert('กรุณาเลือกวันที่');
      return;
    }
    
    const record = {
      ...formData,
      income: parseFloat(formData.income) || 0,
      expense: parseFloat(formData.expense) || 0,
    };

    addRecord(record);
    
    // Reset form but keep the date
    setFormData((prev) => ({
      ...prev,
      item: '',
      income: '',
      expense: '',
      isReimbursable: false,
      note: ''
    }));
  };

  const formatNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalIncome = records.reduce((sum, r) => sum + (r.income || 0), 0);
  const totalExpense = records.reduce((sum, r) => sum + (r.expense || 0), 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="daily-entry-layout">
      <div className="card form-card">
        <h2>บันทึกข้อมูลประจำวัน</h2>
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <label>วันที่</label>
            <input 
              type="date" 
              name="date" 
              className="form-control" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>รายการ</label>
            <input 
              type="text" 
              name="item" 
              className="form-control" 
              placeholder="กรอกชื่อรายการ" 
              value={formData.item} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>รายรับ (บาท)</label>
            <input 
              type="number" 
              name="income" 
              className="form-control" 
              placeholder="0.00" 
              step="0.01" 
              value={formData.income} 
              onChange={handleChange} 
            />
          </div>

          <div className="expense-group" style={{ flexDirection: 'column' }}>
            <div className="form-group">
              <label>รายจ่าย (บาท)</label>
              <input 
                type="number" 
                name="expense" 
                className="form-control" 
                placeholder="0.00" 
                step="0.01" 
                value={formData.expense} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="isReimbursable"
                name="isReimbursable" 
                checked={formData.isReimbursable} 
                onChange={handleChange} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="isReimbursable" style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--reimburse-color)' }}>
                รายการนี้ต้องการตั้งเบิกคืน
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>หมายเหตุ</label>
            <input 
              type="text" 
              name="note" 
              className="form-control" 
              placeholder="เช่น ค่าเดินทาง, ค่าอาหารลูกค้า" 
              value={formData.note} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary w-100">
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>

      <div className="card recent-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: 0 }}>รายการล่าสุด</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            ยอดคงเหลือ: <span className={totalBalance >= 0 ? 'text-success' : 'text-danger'}>{formatNumber(totalBalance)} ฿</span>
          </div>
        </div>
        {records.length === 0 ? (
          <p className="empty-state">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>รายการ</th>
                  <th>รายรับ</th>
                  <th>รายจ่าย</th>
                  <th>สถานะ</th>
                  <th>หมายเหตุ</th>
                  <th style={{width: '50px'}}></th>
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.item || '-'}</td>
                    <td className="text-success">{record.income > 0 ? formatNumber(record.income) : '-'}</td>
                    <td className="text-danger">{record.expense > 0 ? formatNumber(record.expense) : '-'}</td>
                    <td>
                      {record.isReimbursable && record.expense > 0 ? (
                        <span style={{ backgroundColor: 'var(--reimburse-bg)', color: 'var(--reimburse-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                          รอเบิกคืน
                        </span>
                      ) : null}
                    </td>
                    <td>{record.note || '-'}</td>
                    <td className="text-center">
                      <button className="btn-icon" onClick={() => deleteRecord(record.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyEntry;
