import { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';

function WeeklySummary() {
  const { records, clearRecords } = useExpense();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const formatNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Filter records by date range
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      let startMatch = true;
      let endMatch = true;
      if (startDate) {
        startMatch = r.date >= startDate;
      }
      if (endDate) {
        endMatch = r.date <= endDate;
      }
      return startMatch && endMatch;
    });
  }, [records, startDate, endDate]);

  // Calculate totals based on FILTERED records
  const totalIncome = filteredRecords.reduce((sum, r) => sum + (r.income || 0), 0);
  const totalExpense = filteredRecords.reduce((sum, r) => sum + (r.expense || 0), 0);
  const totalReimbursable = filteredRecords.reduce((sum, r) => sum + (r.isReimbursable ? (r.expense || 0) : 0), 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="page-container">
      <div className="summary-header">
        <h2>สรุปข้อมูลรายสัปดาห์ / ทั้งหมด</h2>
        <div className="summary-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>ตั้งแต่:</span>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: 'auto', padding: '0.5rem', minWidth: '130px' }}
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>ถึง:</span>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: 'auto', padding: '0.5rem', minWidth: '130px' }}
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="btn btn-export" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            บันทึกเป็น PDF
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="stat-card">
          <div className="stat-label">ยอดคงเหลือ</div>
          <div className={`stat-value ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>{formatNumber(totalBalance)} ฿</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">รายรับทั้งหมด</div>
          <div className="stat-value text-success">{formatNumber(totalIncome)} ฿</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">รวมค่าใช้จ่ายทั้งหมด</div>
          <div className="stat-value text-danger">{formatNumber(totalExpense)} ฿</div>
        </div>
        <div className="stat-card highlight-card">
          <div className="stat-label">รวมที่ต้องเบิก</div>
          <div className="stat-value text-warning">{formatNumber(totalReimbursable)} ฿</div>
        </div>
      </div>

      <div className="card">
        <h3>รายการข้อมูลทั้งหมด</h3>
        {filteredRecords.length === 0 ? (
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
                  <th>คงเหลือ</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const dailyBalances = {};
                  const recordsWithBalance = filteredRecords.map(r => {
                    if (dailyBalances[r.date] === undefined) {
                      dailyBalances[r.date] = 0;
                    }
                    dailyBalances[r.date] += (r.income || 0) - (r.expense || 0);
                    return { ...r, balance: dailyBalances[r.date] };
                  });
                  return recordsWithBalance.slice().reverse().map(record => (
                    <tr key={record.id}>
                      <td>{formatDate(record.date)}</td>
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
                      <td className={record.balance >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: '600' }}>
                        {formatNumber(record.balance)}
                      </td>
                      <td>{record.note || '-'}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklySummary;
