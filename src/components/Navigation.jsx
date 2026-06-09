import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          ระบบบันทึกรายจ่าย
        </div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            กรอกข้อมูลประจำวัน
          </NavLink>
          <NavLink 
            to="/summary" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            สรุปข้อมูลรายสัปดาห์
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
